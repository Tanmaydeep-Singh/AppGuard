#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::{DateTime, Local};
use std::{
    fs::{File},
    io::{Read, Write},
    path::Path,
    process::Command,
    thread,
    time::{Duration, SystemTime},
};
use serde::{Deserialize, Serialize};
use sysinfo::{ProcessExt, System, SystemExt};
use tauri::{SystemTray, SystemTrayMenu, CustomMenuItem, RunEvent, SystemTrayEvent};

#[derive(Serialize, Deserialize, Debug)]
struct AppList {
    apps: Vec<String>,
    blocked_until: Vec<(String, SystemTime)>,
}

fn create_or_update_json_file(app_name: String, block_end: SystemTime) -> std::io::Result<()> {
    let path = Path::new("../blockedAppList.json");

    let mut app_list = if path.exists() {
        println!("File exists, updating the existing file...");

        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;

        serde_json::from_str::<AppList>(&contents).unwrap_or(AppList { apps: vec![], blocked_until: vec![] })
    } else {
        println!("File doesn't exist, creating a new file...");
        AppList { apps: vec![], blocked_until: vec![] }
    };

    app_list.apps.push(app_name.clone());
    app_list.blocked_until.push((app_name, block_end));
    println!("Added app to block list: {:?}", app_list.apps);

    let updated_json_data = serde_json::to_string_pretty(&app_list)?;

    let mut file = File::create(path)?;
    file.write_all(updated_json_data.as_bytes())?;
    println!("File successfully updated with the new blocked app.");

    Ok(())
}

fn remove_app_from_json_file(app_name: &str) -> std::io::Result<()> {
    let path = Path::new("../blockedAppList.json");

    if path.exists() {
        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;

        let mut app_list: AppList = serde_json::from_str(&contents).unwrap_or(AppList { apps: vec![], blocked_until: vec![] });
        
        app_list.apps.retain(|app| app != app_name);
        app_list.blocked_until.retain(|(app, _)| app != app_name);
        println!("Removed app from block list: {:?}", app_list.apps);

        let updated_json_data = serde_json::to_string_pretty(&app_list)?;

        let mut file = File::create(path)?;
        file.write_all(updated_json_data.as_bytes())?;
        println!("File successfully updated after removing the blocked app.");
    }

    Ok(())
}
fn get_all_blocked_apps() -> Vec<String> {
    let path = Path::new("../blockedAppList.json");

    if path.exists() {
        let mut file = File::open(path).expect("Failed to open file");
        let mut contents = String::new();
        file.read_to_string(&mut contents).expect("Failed to read file");

        let app_list: AppList = serde_json::from_str(&contents).unwrap_or(AppList { apps: vec![], blocked_until: vec![] });
        return app_list.apps;
    }

    println!("No blocked apps found.");
    vec![]
}

fn get_installed_apps_windows() -> Vec<String> {
    let output = Command::new("powershell")
        .arg("-Command")
        .arg("Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*, HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object -Property DisplayName")
        .output()
        .expect("Failed to execute PowerShell command");

    let output_str = String::from_utf8_lossy(&output.stdout);
    let apps_list: Vec<String> = output_str
        .lines()                            
        .filter(|line| !line.is_empty())    
        .map(|line| line.trim().to_string()) 
        .collect();

    apps_list
}

fn is_within_block_period(block_end: SystemTime) -> bool {
    SystemTime::now() < block_end
}

fn block_app(app_name: &str, block_duration: Duration) {
    let app_name = app_name.to_string();
    let block_end = SystemTime::now() + block_duration;
    create_or_update_json_file(app_name.clone(), block_end).expect("Failed to update JSON file");

    thread::spawn(move || {
        println!("Blocking application '{}' until {:?}", app_name, block_end);

        while is_within_block_period(block_end) {
            let mut system = System::new_all();
            system.refresh_all();

            for (pid, process) in system.processes() {
                if process.name().to_lowercase().contains(&app_name.to_lowercase()) {
                    println!("Terminating process: {} (pid: {})", process.name(), pid);
                    process.kill();
                }
            }
            thread::sleep(Duration::from_secs(5));
        }

        println!("Blocking period over for '{}'.", app_name);
        remove_app_from_json_file(&app_name).expect("Failed to remove app from JSON file");
    });
}


#[tauri::command]
fn greet(name: &str) -> Vec<String> {
    println!("{}",name);
    let app_list = get_installed_apps_windows();
    app_list
}

#[tauri::command]
fn unblock_app(app_name: String) -> String {
    match remove_app_from_json_file(&app_name) {
        Ok(_) => format!("Unblocking app '{}'", app_name),
        Err(e) => format!("Failed to unblock app '{}': {:?}", app_name, e),
    }
}

#[tauri::command]
fn get_local_time() -> String {
    let app_name = "notepad"; 
    let block_duration = Duration::from_secs(20);
    block_app(app_name, block_duration);

    let local: DateTime<Local> = Local::now();
    println!("Local time: {local}");
    local.to_string()
}

#[tauri::command]
fn block_app_for_time_range(app_name: String, start_time_str: String, end_time_str: String) -> String {
    println!("Blocking app: {}", app_name);

    let start_time = DateTime::parse_from_rfc3339(&start_time_str)
        .expect("Failed to parse start time")
        .with_timezone(&Local);
    let end_time = DateTime::parse_from_rfc3339(&end_time_str)
        .expect("Failed to parse end time")
        .with_timezone(&Local);

    let block_duration = end_time.signed_duration_since(start_time).to_std().unwrap_or(Duration::from_secs(0));

    block_app(&app_name, block_duration);

    let local: DateTime<Local> = Local::now();
    println!("Blocking app '{}' for {} seconds", app_name, block_duration.as_secs());
    local.to_string()
}

#[tauri::command]
fn get_all_blocked_apps_command() -> Vec<String> {
    get_all_blocked_apps()
}

fn main() {
    let open_item = CustomMenuItem::new("open".to_string(), "App Guard");
    let quit_item = CustomMenuItem::new("quit".to_string(), "Quit");

    let tray_menu = SystemTrayMenu::new()
        .add_item(open_item)
        .add_item(quit_item);
        
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|_app,event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "open" => {
                    println!("Open Application clicked"); 
                }
                _ => {} 
            },
            _ => {} 
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_local_time,
            block_app_for_time_range,
            unblock_app,
            get_all_blocked_apps_command 
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit(); 
            }
            _ => {}
        });
}