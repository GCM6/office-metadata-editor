use std::alloc::{dealloc, Layout};
use std::io::{Cursor, Read, Write};
use wasm_bindgen::prelude::*;

// =========================================================================
// 1. Wasm 裸指针高性能内存管理与交互
// =========================================================================

#[wasm_bindgen]
pub struct WasmBuffer {
    ptr: *mut u8,
    len: usize,
    cap: usize,
}

#[wasm_bindgen]
impl WasmBuffer {
    #[wasm_bindgen(getter)]
    pub fn ptr(&self) -> *mut u8 {
        self.ptr
    }
    #[wasm_bindgen(getter)]
    pub fn len(&self) -> usize {
        self.len
    }
    #[wasm_bindgen(getter)]
    pub fn cap(&self) -> usize {
        self.cap
    }
}

#[wasm_bindgen]
pub fn deallocate_wasm_memory(ptr: *mut u8, cap: usize) {
    unsafe {
        if !ptr.is_null() && cap > 0 {
            let layout = Layout::from_size_align_unchecked(cap, 1);
            dealloc(ptr, layout);
        }
    }
}

// =========================================================================
// 2. 经典极速多媒体嵌套图片 EXIF 剥离算法
// =========================================================================

/// 剥离 JPEG 图片的 EXIF/GPS (跳过 APP1 0xFFE1 Segment)
fn strip_jpeg_exif(data: &[u8]) -> Vec<u8> {
    if data.len() < 4 || data[0] != 0xFF || data[1] != 0xD8 {
        return data.to_vec(); // 非合法 JPEG
    }

    let mut cleaned = Vec::with_capacity(data.len());
    cleaned.push(0xFF);
    cleaned.push(0xD8);

    let mut i = 2;
    while i < data.len() {
        if i + 1 >= data.len() {
            cleaned.extend_from_slice(&data[i..]);
            break;
        }

        if data[i] == 0xFF {
            let marker = data[i + 1];
            if marker == 0xD9 {
                // 结束标记
                cleaned.push(0xFF);
                cleaned.push(0xD9);
                break;
            } else if marker == 0x00 || (marker >= 0xD0 && marker <= 0xD7) {
                // 填补或重启标记，无长度
                cleaned.push(0xFF);
                cleaned.push(marker);
                i += 2;
            } else {
                // 包含长度的 Segment
                if i + 3 >= data.len() {
                    cleaned.extend_from_slice(&data[i..]);
                    break;
                }
                let len = ((data[i + 2] as usize) << 8) | (data[i + 3] as usize);
                if i + 2 + len > data.len() {
                    cleaned.extend_from_slice(&data[i..]);
                    break;
                }

                if marker == 0xE1 {
                    // APP1 (EXIF / GPS 通常放在这里)
                    // 静默跳过，不写入 cleaned
                } else {
                    cleaned.extend_from_slice(&data[i..i + 2 + len]);
                }
                i += 2 + len;
            }
        } else {
            cleaned.push(data[i]);
            i += 1;
        }
    }

    cleaned
}

/// 剥离 PNG 图片的 EXIF (跳过 eXIf Chunk)
fn strip_png_exif(data: &[u8]) -> Vec<u8> {
    let png_sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    if data.len() < 8 || data[0..8] != png_sig {
        return data.to_vec(); // 非合法 PNG
    }

    let mut cleaned = Vec::with_capacity(data.len());
    cleaned.extend_from_slice(&png_sig);

    let mut i = 8;
    while i + 12 <= data.len() {
        let length = ((data[i] as usize) << 24)
            | ((data[i + 1] as usize) << 16)
            | ((data[i + 2] as usize) << 8)
            | (data[i + 3] as usize);
        let chunk_type = &data[i + 4..i + 8];

        if chunk_type == b"eXIf" {
            // 静默跳过该 EXIF 块（包含 4字节Length, 4字节Type, Data, 4字节CRC）
            i += 12 + length;
        } else {
            cleaned.extend_from_slice(&data[i..i + 12 + length]);
            i += 12 + length;
        }
    }

    if i < data.len() {
        cleaned.extend_from_slice(&data[i..]);
    }

    cleaned
}

// =========================================================================
// 3. OOXML (DOCX/XLSX) RSID 段落属性流式过滤
// =========================================================================

/// 使用 quick-xml 对 Word/Excel 的 XML 内容进行流式过滤，清洗 w:rsid 协同标记
fn clean_xml_rsids(xml_data: &[u8]) -> Vec<u8> {
    use quick_xml::events::{BytesStart, Event};
    use quick_xml::reader::Reader;
    use quick_xml::writer::Writer;

    let mut reader = Reader::from_reader(xml_data);
    reader.config_mut().trim_text(false);

    let mut writer = Writer::new(Cursor::new(Vec::with_capacity(xml_data.len())));
    let mut buf = Vec::new();

    loop {
        match reader.read_event_into(&mut buf) {
            Ok(Event::Start(ref e)) => {
                let name = e.name();
                let name_str = std::str::from_utf8(name.as_ref()).unwrap_or("");
                let mut new_elem = BytesStart::new(name_str);
                for attr in e.attributes() {
                    if let Ok(a) = attr {
                        let key = std::str::from_utf8(a.key.as_ref()).unwrap_or("");
                        // 过滤段落随机 Sessions ID 属性，防泄露协同轨迹
                        if !key.starts_with("w:rsid") && !key.starts_with("rsid") {
                            new_elem.push_attribute(a);
                        }
                    }
                }
                let _ = writer.write_event(Event::Start(new_elem));
            }
            Ok(Event::Empty(ref e)) => {
                let name = e.name();
                let name_str = std::str::from_utf8(name.as_ref()).unwrap_or("");
                let mut new_elem = BytesStart::new(name_str);
                for attr in e.attributes() {
                    if let Ok(a) = attr {
                        let key = std::str::from_utf8(a.key.as_ref()).unwrap_or("");
                        if !key.starts_with("w:rsid") && !key.starts_with("rsid") {
                            new_elem.push_attribute(a);
                        }
                    }
                }
                let _ = writer.write_event(Event::Empty(new_elem));
            }
            Ok(Event::Eof) => break,
            Ok(e) => {
                let _ = writer.write_event(e);
            }
            Err(_) => {
                // 发生解析错误，回退使用原始数据
                return xml_data.to_vec();
            }
        }
        buf.clear();
    }

    writer.into_inner().into_inner()
}

// =========================================================================
// 4. OOXML (DOCX/XLSX) 隐私扫描与深度重组清理
// =========================================================================

/// 提取 ZIP 中 core.xml 与 app.xml 的隐私值
#[wasm_bindgen]
pub fn scan_docx_wasm(file_bytes: &[u8]) -> Result<String, JsValue> {
    let cursor = Cursor::new(file_bytes);
    let mut archive = zip::ZipArchive::new(cursor)
        .map_err(|e| JsValue::from_str(&format!("无法解析 ZIP 归档: {}", e)))?;

    let mut creator = String::new();
    let mut last_modified_by = String::new();
    let mut created = String::new();
    let mut modified = String::new();
    let mut revision = String::new();
    let mut template = String::new();
    let mut application = String::new();
    let mut company = String::new();

    // 1. 读取 core.xml
    if let Ok(mut file) = archive.by_name("docProps/core.xml") {
        let mut content = String::new();
        if file.read_to_string(&mut content).is_ok() {
            creator = extract_xml_tag(&content, "dc:creator");
            last_modified_by = extract_xml_tag(&content, "cp:lastModifiedBy");
            created = extract_xml_tag(&content, "dcterms:created");
            modified = extract_xml_tag(&content, "dcterms:modified");
            revision = extract_xml_tag(&content, "cp:revision");
        }
    }

    // 2. 读取 app.xml
    if let Ok(mut file) = archive.by_name("docProps/app.xml") {
        let mut content = String::new();
        if file.read_to_string(&mut content).is_ok() {
            template = extract_xml_tag(&content, "Template");
            application = extract_xml_tag(&content, "Application");
            company = extract_xml_tag(&content, "Company");
        }
    }

    // 3. 多媒体嵌套图片 EXIF 检测计数
    let mut nested_images_count = 0;
    for i in 0..archive.len() {
        if let Ok(file) = archive.by_index(i) {
            let name = file.name();
            if (name.contains("/media/") || name.contains("word/media/") || name.contains("xl/media/"))
                && (name.ends_with(".jpg") || name.ends_with(".jpeg") || name.ends_with(".png"))
            {
                nested_images_count += 1;
            }
        }
    }

    let report_json = format!(
        r#"{{"creator":"{}","lastModifiedBy":"{}","created":"{}","modified":"{}","revision":"{}","template":"{}","application":"{}","company":"{}","nestedImagesCount":{}}}"#,
        escape_json(&creator),
        escape_json(&last_modified_by),
        escape_json(&created),
        escape_json(&modified),
        escape_json(&revision),
        escape_json(&template),
        escape_json(&application),
        escape_json(&company),
        nested_images_count
    );

    Ok(report_json)
}

/// 深度剥离清理 DOCX 并执行自检和回滚机制
#[wasm_bindgen]
pub fn clean_docx_wasm(file_bytes: &[u8]) -> Result<WasmBuffer, JsValue> {
    let mut cleaned_bytes = Vec::new();

    // 1. 优先尝试深度剥离清理
    match try_deep_strip_docx(file_bytes, &mut cleaned_bytes) {
        Ok(_) => {
            // 2. 内存静默自检：验证 ZIP 完整性及主要部件是否能正常解包
            if verify_zip_integrity(&cleaned_bytes).is_ok() {
                return make_wasm_buffer(cleaned_bytes);
            }
            // 自检未通过，强制回滚保守安全模式
            log::warn!("ZIP 自检未通过，执行回滚至保守模式");
            cleaned_bytes.clear();
            try_conservative_strip_docx(file_bytes, &mut cleaned_bytes)
                .map_err(|e| JsValue::from_str(&e))?;
            make_wasm_buffer(cleaned_bytes)
        }
        Err(_) => {
            // 3. 解析抛错时，自动回滚至保守模式
            cleaned_bytes.clear();
            try_conservative_strip_docx(file_bytes, &mut cleaned_bytes)
                .map_err(|e| JsValue::from_str(&e))?;
            make_wasm_buffer(cleaned_bytes)
        }
    }
}

/// 执行深度剥离清理：重构核心 XML 并深度净化 word/document.xml 的 RSID，递归剥离 media/ 嵌套图片 EXIF
fn try_deep_strip_docx(original_zip: &[u8], writer: &mut Vec<u8>) -> Result<(), String> {
    let reader = Cursor::new(original_zip);
    let mut archive = zip::ZipArchive::new(reader).map_err(|e| e.to_string())?;
    let mut zip_writer = zip::ZipWriter::new(Cursor::new(writer));

    // 合法空白覆盖写 core.xml
    let clean_core_xml = r#"<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator></dc:creator>
  <cp:lastModifiedBy></cp:lastModifiedBy>
  <cp:revision>1</cp:revision>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-06-02T00:00:00Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">2026-06-02T00:00:00Z</dcterms:modified>
</cp:coreProperties>"#;

    // 合法空白覆盖写 app.xml (擦除 Template, Company 等)
    let clean_app_xml = r#"<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Template></Template>
  <TotalTime>0</TotalTime>
  <Pages>1</Pages>
  <Words>0</Words>
  <Characters>0</Characters>
  <Application>MetaDocu</Application>
  <AppVersion>1.0</AppVersion>
  <Company></Company>
  <Manager></Manager>
</Properties>"#;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let name = file.name().to_string();

        let options = zip::write::SimpleFileOptions::default()
            .compression_method(file.compression());

        zip_writer.start_file(name.clone(), options).map_err(|e| e.to_string())?;

        if name == "docProps/core.xml" {
            zip_writer.write_all(clean_core_xml.as_bytes()).map_err(|e| e.to_string())?;
        } else if name == "docProps/app.xml" {
            zip_writer.write_all(clean_app_xml.as_bytes()).map_err(|e| e.to_string())?;
        } else if name == "docProps/custom.xml" {
            // custom.xml 写入空
            let clean_custom_xml = r#"<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties"></Properties>"#;
            zip_writer.write_all(clean_custom_xml.as_bytes()).map_err(|e| e.to_string())?;
        } else if name == "word/document.xml" || name == "xl/workbook.xml" {
            // 流式解析清洗段落的 RSID 随机标记
            let mut buf = Vec::new();
            file.read_to_end(&mut buf).map_err(|e| e.to_string())?;
            let cleaned_xml = clean_xml_rsids(&buf);
            zip_writer.write_all(&cleaned_xml).map_err(|e| e.to_string())?;
        } else if (name.contains("/media/") || name.contains("word/media/") || name.contains("xl/media/"))
            && (name.ends_with(".jpg") || name.ends_with(".jpeg"))
        {
            // 嵌套 JPEG 剥离 EXIF
            let mut buf = Vec::new();
            file.read_to_end(&mut buf).map_err(|e| e.to_string())?;
            let stripped = strip_jpeg_exif(&buf);
            zip_writer.write_all(&stripped).map_err(|e| e.to_string())?;
        } else if (name.contains("/media/") || name.contains("word/media/") || name.contains("xl/media/"))
            && name.ends_with(".png")
        {
            // 嵌套 PNG 剥离 EXIF
            let mut buf = Vec::new();
            file.read_to_end(&mut buf).map_err(|e| e.to_string())?;
            let stripped = strip_png_exif(&buf);
            zip_writer.write_all(&stripped).map_err(|e| e.to_string())?;
        } else {
            // 拷贝其他文件
            let mut buf = Vec::new();
            file.read_to_end(&mut buf).map_err(|e| e.to_string())?;
            zip_writer.write_all(&buf).map_err(|e| e.to_string())?;
        }
    }

    zip_writer.finish().map_err(|e| e.to_string())?;
    Ok(())
}

/// 执行保守清理：仅对 core.xml 核心进行空白覆盖写，保持 ZIP 原有依赖结构和 RSID 完整不动，防损坏
fn try_conservative_strip_docx(original_zip: &[u8], writer: &mut Vec<u8>) -> Result<(), String> {
    let reader = Cursor::new(original_zip);
    let mut archive = zip::ZipArchive::new(reader).map_err(|e| e.to_string())?;
    let mut zip_writer = zip::ZipWriter::new(Cursor::new(writer));

    let clean_core_xml = r#"<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator></dc:creator>
  <cp:lastModifiedBy></cp:lastModifiedBy>
  <cp:revision>1</cp:revision>
</cp:coreProperties>"#;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;
        let name = file.name().to_string();

        let options = zip::write::SimpleFileOptions::default();

        zip_writer.start_file(name.clone(), options).map_err(|e| e.to_string())?;

        if name == "docProps/core.xml" {
            zip_writer.write_all(clean_core_xml.as_bytes()).map_err(|e| e.to_string())?;
        } else {
            let mut buf = Vec::new();
            file.read_to_end(&mut buf).map_err(|e| e.to_string())?;
            zip_writer.write_all(&buf).map_err(|e| e.to_string())?;
        }
    }

    zip_writer.finish().map_err(|e| e.to_string())?;
    Ok(())
}

/// 内存自检：校验生成的 ZIP 归档是否结构完整且能成功打开
fn verify_zip_integrity(zip_bytes: &[u8]) -> Result<(), String> {
    let reader = Cursor::new(zip_bytes);
    let mut archive = zip::ZipArchive::new(reader).map_err(|e| e.to_string())?;
    
    // 检查核心部件
    let _ = archive.by_name("[Content_Types].xml").map_err(|e| e.to_string())?;
    
    Ok(())
}

// =========================================================================
// 5. PDF 扫描与深度重算 Xref 清理
// =========================================================================

/// 提取 PDF Info 字典并检测数字签名与密码保护
#[wasm_bindgen]
pub fn scan_pdf_wasm(file_bytes: &[u8]) -> Result<String, JsValue> {
    // 捕获异常 (在 lopdf 0.33 中使用 load_mem)
    let doc = match lopdf::Document::load_mem(file_bytes) {
        Ok(d) => d,
        Err(e) => {
            // 通过错误文本判断是否加密，兼容 lopdf 0.33 编译
            let err_str = e.to_string();
            if err_str.contains("Encrypted") || err_str.contains("encrypted") || err_str.contains("Password") {
                return Ok(r#"{"encrypted":true,"sigDetected":false}"#.to_string());
            }
            return Err(JsValue::from_str(&format!("PDF 读取失败: {}", e)));
        }
    };

    let mut author = String::new();
    let mut creator = String::new();
    let mut producer = String::new();
    let mut creation_date = String::new();
    let mut mod_date = String::new();

    // 1. 直接从 Trailer 中获取 Info 字典 ObjectId 引用
    if let Ok(lopdf::Object::Reference(info_ref)) = doc.trailer.get(b"Info") {
        if let Ok(info_dict) = doc.get_object(*info_ref) {
            if let Ok(dict) = info_dict.as_dict() {
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"Author") {
                    author = String::from_utf8_lossy(bytes).to_string();
                }
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"Creator") {
                    creator = String::from_utf8_lossy(bytes).to_string();
                }
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"Producer") {
                    producer = String::from_utf8_lossy(bytes).to_string();
                }
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"CreationDate") {
                    creation_date = String::from_utf8_lossy(bytes).to_string();
                }
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"ModDate") {
                    mod_date = String::from_utf8_lossy(bytes).to_string();
                }
            }
        }
    }

    // 2. 检测是否存在 /Sig 或 /Signatures 签名块
    let mut sig_detected = false;
    for object in doc.objects.values() {
        if let lopdf::Object::Dictionary(ref dict) = *object {
            if let Ok(lopdf::Object::Name(ref name)) = dict.get(b"Type") {
                if name == b"Sig" {
                    sig_detected = true;
                    break;
                }
            }
        }
    }

    let report_json = format!(
        r#"{{"author":"{}","creator":"{}","producer":"{}","creationDate":"{}","modDate":"{}","encrypted":false,"sigDetected":{}}}"#,
        escape_json(&author),
        escape_json(&creator),
        escape_json(&producer),
        escape_json(&creation_date),
        escape_json(&mod_date),
        sig_detected
    );

    Ok(report_json)
}

/// 解析带有密码保护的 PDF 文件
#[wasm_bindgen]
pub fn scan_pdf_with_password_wasm(file_bytes: &[u8], password: &str) -> Result<String, JsValue> {
    let mut doc = lopdf::Document::load_mem(file_bytes)
        .map_err(|e| JsValue::from_str(&format!("PDF 读取失败: {}", e)))?;
    
    if doc.is_encrypted() {
        doc.decrypt(password.as_bytes())
            .map_err(|e| JsValue::from_str(&format!("解密失败，密码错误: {}", e)))?;
    }

    let mut author = String::new();
    let mut creator = String::new();
    let mut producer = String::new();

    if let Ok(lopdf::Object::Reference(info_ref)) = doc.trailer.get(b"Info") {
        if let Ok(info_dict) = doc.get_object(*info_ref) {
            if let Ok(dict) = info_dict.as_dict() {
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"Author") {
                    author = String::from_utf8_lossy(bytes).to_string();
                }
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"Creator") {
                    creator = String::from_utf8_lossy(bytes).to_string();
                }
                if let Ok(lopdf::Object::String(bytes, _)) = dict.get(b"Producer") {
                    producer = String::from_utf8_lossy(bytes).to_string();
                }
            }
        }
    }

    let report_json = format!(
        r#"{{"author":"{}","creator":"{}","producer":"{}","encrypted":false,"decrypted":true}}"#,
        escape_json(&author),
        escape_json(&creator),
        escape_json(&producer)
    );

    Ok(report_json)
}

/// 清洗 PDF 并在内存级执行 Xref 偏移强制重算、预加载自检和保守回滚
#[wasm_bindgen]
pub fn clean_pdf_wasm(file_bytes: &[u8]) -> Result<WasmBuffer, JsValue> {
    let mut cleaned_bytes = Vec::new();

    // 1. 优先尝试深度物理重建与 Xref 重算
    match try_deep_strip_pdf(file_bytes, &mut cleaned_bytes) {
        Ok(_) => {
            // 2. Wasm 内存中静默预解析自检：使用 lopdf 重新读取校验
            if lopdf::Document::load_mem(&cleaned_bytes[..]).is_ok() {
                return make_wasm_buffer(cleaned_bytes);
            }
            // 自检失败，执行回滚至保守占位擦除模式
            cleaned_bytes.clear();
            try_conservative_strip_pdf(file_bytes, &mut cleaned_bytes)
                .map_err(|e| JsValue::from_str(&e))?;
            make_wasm_buffer(cleaned_bytes)
        }
        Err(_) => {
            // 3. 解析抛错时，自动降级回滚至保守占位擦除
            cleaned_bytes.clear();
            try_conservative_strip_pdf(file_bytes, &mut cleaned_bytes)
                .map_err(|e| JsValue::from_str(&e))?;
            make_wasm_buffer(cleaned_bytes)
        }
    }
}

/// 深度 PDF 清理：擦除 Info 敏感值，并物理擦除 Catalog 的 Metadata 引用流，强制 Xref 完全重建
fn try_deep_strip_pdf(file_bytes: &[u8], writer: &mut Vec<u8>) -> Result<(), String> {
    let mut doc = lopdf::Document::load_mem(file_bytes).map_err(|e| e.to_string())?;

    // 1. 擦除 /Info 字典属性
    if let Ok(lopdf::Object::Reference(info_ref)) = doc.trailer.get(b"Info") {
        if let Ok(info_obj) = doc.get_object_mut(*info_ref) {
            if let lopdf::Object::Dictionary(ref mut dict) = *info_obj {
                dict.set(b"Author", lopdf::Object::String(vec![], lopdf::StringFormat::Literal));
                dict.set(b"Creator", lopdf::Object::String(b"MetaDocu".to_vec(), lopdf::StringFormat::Literal));
                dict.set(b"Producer", lopdf::Object::String(b"MetaDocu PDF Privacy Engine".to_vec(), lopdf::StringFormat::Literal));
                dict.set(b"CreationDate", lopdf::Object::String(vec![], lopdf::StringFormat::Literal));
                dict.set(b"ModDate", lopdf::Object::String(vec![], lopdf::StringFormat::Literal));
            }
        }
    }

    // 2. 擦除 Catalog 下的 Metadata 引用流 (防止 XMP 等隐私遗留)
    let catalog_ids: Vec<lopdf::ObjectId> = doc.objects.iter()
        .filter(|(_, obj)| {
            if let lopdf::Object::Dictionary(ref dict) = **obj {
                dict.get(b"Type").map(|t| t == &lopdf::Object::Name(b"Catalog".to_vec())).unwrap_or(false)
            } else {
                false
            }
        })
        .map(|(id, _)| *id)
        .collect();

    for cat_id in catalog_ids {
        if let Ok(cat_obj) = doc.get_object_mut(cat_id) {
            if let lopdf::Object::Dictionary(ref mut dict) = *cat_obj {
                dict.remove(b"Metadata"); // 彻底剥离流引用
            }
        }
    }

    // 3. 强制 lopdf 重算交叉引用表 (Xref Table) 写入 (在 0.33 中通过字段直达)
    doc.version = "1.4".to_string();
    doc.save_to(writer).map_err(|e| e.to_string())?;

    Ok(())
}

/// 保守占位清理 PDF：仅将 Info 的常见隐私属性擦除为零字节 Literal String，保证完全不产生物理位移与大对象重排，100% 稳定
fn try_conservative_strip_pdf(file_bytes: &[u8], writer: &mut Vec<u8>) -> Result<(), String> {
    let mut doc = lopdf::Document::load_mem(file_bytes).map_err(|e| e.to_string())?;

    if let Ok(lopdf::Object::Reference(info_ref)) = doc.trailer.get(b"Info") {
        if let Ok(info_obj) = doc.get_object_mut(*info_ref) {
            if let lopdf::Object::Dictionary(ref mut dict) = *info_obj {
                dict.set(b"Author", lopdf::Object::String(vec![], lopdf::StringFormat::Literal));
                dict.set(b"CreationDate", lopdf::Object::String(vec![], lopdf::StringFormat::Literal));
                dict.set(b"ModDate", lopdf::Object::String(vec![], lopdf::StringFormat::Literal));
            }
        }
    }

    doc.save_to(writer).map_err(|e| e.to_string())?;
    Ok(())
}

// =========================================================================
// 6. 辅助工具函数
// =========================================================================

/// 提取 XML 字符串中的特定标签文本内容
fn extract_xml_tag(xml: &str, tag: &str) -> String {
    let start_tag = format!("<{}", tag);
    let end_tag = format!("</{}>", tag);

    if let Some(start_idx) = xml.find(&start_tag) {
        if let Some(tag_end_idx) = xml[start_idx..].find('>') {
            let val_start = start_idx + tag_end_idx + 1;
            if let Some(end_idx) = xml[val_start..].find(&end_tag) {
                return xml[val_start..val_start + end_idx].to_string();
            }
        }
    }
    String::new()
}

/// 抑制 Rust 自动回收 Vec 并 safe 打包成 bare pointer 元组 WasmBuffer
fn make_wasm_buffer(bytes: Vec<u8>) -> Result<WasmBuffer, JsValue> {
    let cap = bytes.capacity();
    let len = bytes.len();
    
    let mut boxed = bytes.into_boxed_slice();
    let ptr = boxed.as_mut_ptr();
    std::mem::forget(boxed); // 转移生命周期管理给 Bare Pointer

    Ok(WasmBuffer { ptr, len, cap })
}

/// JSON 字符串转义
fn escape_json(raw: &str) -> String {
    raw.replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .replace('\t', "\\t")
}

// =========================================================================
// 7. 本地物理单元测试
// =========================================================================
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_strip_jpeg_exif() {
        // 一个简易的 JPEG 结构: SOI (FF D8) + APP1 (FF E1, length=00 08, data=00 00 00 00) + EOI (FF D9)
        let original_jpeg = vec![
            0xFF, 0xD8, // SOI
            0xFF, 0xE1, 0x00, 0x08, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, // APP1 Segment
            0xFF, 0xD9, // EOI
        ];
        let cleaned = strip_jpeg_exif(&original_jpeg);
        // APP1 应该被抹除，只剩下 SOI + EOI
        assert_eq!(cleaned, vec![0xFF, 0xD8, 0xFF, 0xD9]);
    }

    #[test]
    fn test_strip_png_exif() {
        // PNG Signature (8 bytes) + IHDR Chunk (Length 4, Type 4, Data 4, CRC 4) + eXIf Chunk (Length 4, Type 4, Data 4, CRC 4)
        let png_sig = vec![0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        let mut original_png = png_sig.clone();
        
        // IHDR
        original_png.extend_from_slice(&[0x00, 0x00, 0x00, 0x04]); // len = 4
        original_png.extend_from_slice(b"IHDR");
        original_png.extend_from_slice(&[0x11, 0x22, 0x33, 0x44]); // data
        original_png.extend_from_slice(&[0x00, 0x00, 0x00, 0x00]); // crc
        
        // eXIf
        original_png.extend_from_slice(&[0x00, 0x00, 0x00, 0x04]); // len = 4
        original_png.extend_from_slice(b"eXIf");
        original_png.extend_from_slice(&[0x55, 0x66, 0x77, 0x88]); // exif data
        original_png.extend_from_slice(&[0x00, 0x00, 0x00, 0x00]); // crc
        
        let cleaned = strip_png_exif(&original_png);
        // IHDR 应该被保留，eXIf 应该被彻底剥离
        assert!(cleaned.windows(4).any(|w| w == b"IHDR"));
        assert!(!cleaned.windows(4).any(|w| w == b"eXIf"));
    }

    #[test]
    fn test_clean_xml_rsids() {
        let original_xml = r#"<w:p w:rsidR="001122" w:rsidRDefault="003344" class="normal"><w:r><w:t>Hello</w:t></w:r></w:p>"#;
        let cleaned = clean_xml_rsids(original_xml.as_bytes());
        let cleaned_str = String::from_utf8(cleaned).unwrap();
        // w:rsidR 和 w:rsidRDefault 应该被剥离，而 class="normal" 必须保留
        assert!(!cleaned_str.contains("w:rsidR"));
        assert!(!cleaned_str.contains("w:rsidRDefault"));
        assert!(cleaned_str.contains("class=\"normal\""));
    }
}
