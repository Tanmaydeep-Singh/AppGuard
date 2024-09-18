#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

fn get_installed_apps_windows() -> Vec<String> {
    let output = Command::new("powershell")
        .arg("-Command")
        .arg("Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object -Property DisplayName")
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> Vec<String> {
    let app_list = get_installed_apps_windows();
    app_list
}
