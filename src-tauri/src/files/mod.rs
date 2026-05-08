use std::fs;
use std::path::PathBuf;

use tauri_plugin_dialog::{DialogExt, FilePath};

use crate::documents::docx::{
    self, BatchSaveRequestItem, BatchSaveResultItem, DocumentMetadata,
};

#[tauri::command]
pub fn save_docx_metadata(
    app_handle: tauri::AppHandle,
    file_bytes: Vec<u8>,
    metadata: DocumentMetadata,
) -> Result<Option<String>, String> {
    let suggested_name = if metadata.file_name.trim().is_empty() {
        "document.docx".to_string()
    } else {
        metadata.file_name.clone()
    };

    let selected_path = app_handle
        .dialog()
        .file()
        .set_title("保存文档")
        .set_file_name(&suggested_name)
        .add_filter("Word 文档", &["docx"])
        .blocking_save_file()
        .and_then(convert_file_path_to_pathbuf);

    let Some(path) = selected_path else {
        return Ok(None);
    };

    let updated_file_bytes = docx::build_updated_docx_bytes(file_bytes, &metadata)?;
    fs::write(&path, updated_file_bytes).map_err(|err| err.to_string())?;

    Ok(Some(path.to_string_lossy().to_string()))
}

#[tauri::command]
pub fn save_docx_metadata_to_source(
    file_path: String,
    metadata: DocumentMetadata,
) -> Result<String, String> {
    let file_bytes = fs::read(&file_path).map_err(|err| err.to_string())?;
    let updated_file_bytes = docx::build_updated_docx_bytes(file_bytes, &metadata)?;
    fs::write(&file_path, updated_file_bytes).map_err(|err| err.to_string())?;
    Ok(file_path)
}

#[tauri::command]
pub fn batch_save_docx_metadata_to_source(
    items: Vec<BatchSaveRequestItem>,
) -> Vec<BatchSaveResultItem> {
    items
        .into_iter()
        .map(|item| match save_docx_metadata_to_source(item.file_path.clone(), item.metadata) {
            Ok(path) => BatchSaveResultItem {
                file_path: path,
                success: true,
                error: None,
            },
            Err(err) => BatchSaveResultItem {
                file_path: item.file_path,
                success: false,
                error: Some(err),
            },
        })
        .collect()
}

#[tauri::command]
pub fn save_docx_metadata_as(
    app_handle: tauri::AppHandle,
    file_path: String,
    metadata: DocumentMetadata,
) -> Result<Option<String>, String> {
    let source_path = PathBuf::from(&file_path);
    let source_file_name = source_path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("document.docx");
    let suggested_name = if metadata.file_name.trim().is_empty() {
        source_file_name.to_string()
    } else {
        metadata.file_name.clone()
    };

    let selected_path = app_handle
        .dialog()
        .file()
        .set_title("另存为")
        .set_file_name(&suggested_name)
        .add_filter("Word 文档", &["docx"])
        .blocking_save_file()
        .and_then(convert_file_path_to_pathbuf);

    let Some(path) = selected_path else {
        return Ok(None);
    };

    let file_bytes = fs::read(&source_path).map_err(|err| err.to_string())?;
    let updated_file_bytes = docx::build_updated_docx_bytes(file_bytes, &metadata)?;
    fs::write(&path, updated_file_bytes).map_err(|err| err.to_string())?;

    Ok(Some(path.to_string_lossy().to_string()))
}

#[tauri::command]
pub fn batch_clear_and_save_docx_metadata(file_paths: Vec<String>) -> Vec<BatchSaveResultItem> {
    file_paths
        .into_iter()
        .map(|file_path| match docx::process_single_batch_clear(&file_path) {
            Ok(()) => BatchSaveResultItem {
                file_path,
                success: true,
                error: None,
            },
            Err(err) => BatchSaveResultItem {
                file_path,
                success: false,
                error: Some(err),
            },
        })
        .collect()
}

fn convert_file_path_to_pathbuf(file_path: FilePath) -> Option<PathBuf> {
    match file_path {
        FilePath::Path(path) => Some(path),
        FilePath::Url(url) => url.to_file_path().ok(),
    }
}
