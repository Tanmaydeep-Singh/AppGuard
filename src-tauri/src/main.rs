#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use chrono::{DateTime, Local};
use std::{thread, time::{Duration, SystemTime}};
use sysinfo::{ProcessExt, System, SystemExt};
use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem,RunEvent};


fn get_installed_apps_windows() -> Vec<String> {
    let output = Command::new("powershell")
        .arg("-Command")
        .arg("Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*, HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object -Property DisplayName")
        .output()
        .expect("Failed to execute PowerShell command");

    let output_str = String::from_utf8_lossy(&output.stdout);
    let apps_list: Vec<String> = output_str
        .lines()                            // Split the output by lines
        .filter(|line| !line.is_empty())     // Filter out empty lines
        .map(|line| line.trim().to_string()) // Trim whitespace and convert to String
        .collect();

    apps_list
}

fn is_within_block_period(block_end: SystemTime) -> bool {
    SystemTime::now() < block_end
}

fn block_app(app_name: &str, block_duration: Duration) {
    let app_name = app_name.to_string(); 

    thread::spawn(move || {
        let block_end = SystemTime::now() + block_duration;
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
    });
}



fn main() {
    let tray_menu = SystemTrayMenu::new(); // insert the menu items here
    let system_tray = SystemTray::new()
      .with_menu(tray_menu);

    
    tauri::Builder::default()
        .system_tray(system_tray)
        .invoke_handler(tauri::generate_handler![greet,get_local_time,block_app_for_time_range])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit(); 
            }
            _ => {}
        });


    }

#[tauri::command]
fn greet(name: &str) -> Vec<String> {
    let app_list = get_installed_apps_windows();
    app_list
}

#[tauri::command]
fn get_local_time() -> String {
    
    let app_name = "notepad"; // The app to block
    let block_duration = Duration::from_secs(20); // 10 minutes
    block_app(app_name, block_duration);

    let local: DateTime<Local> = Local::now();
    println!("hello time {local}");
    local.to_string() 
}

#[tauri::command]
fn block_app_for_time_range(app_name: String, start_time_str: String, end_time_str: String) -> String {
    println!("HELLO");
    println!("hello time {app_name}");

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