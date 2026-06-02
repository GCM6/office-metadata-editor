// Wasm Web Worker 异步计算通道 (Wasm Web Worker Channel)
// 承载 CPU 密集型的 PDF/OOXML 解析与深度清理，防止浏览器 UI 主线程假死

import initWasm, {
  scan_docx_wasm,
  clean_docx_wasm,
  scan_pdf_wasm,
  clean_pdf_wasm,
  scan_pdf_with_password_wasm,
  deallocate_wasm_memory
} from "../wasm/office_metadata_parser_wasm/office_metadata_parser_wasm";

let isWasmInitialized = false;
let wasmInstance: any = null;

const ctx: Worker = self as any;

ctx.onmessage = async (e: MessageEvent) => {
  const { type, fileBytes, fileName, password } = e.data;

  // 1. 惰性单例初始化，保证 Wasm 模块仅在 Worker 线程内初始化一次
  if (!isWasmInitialized) {
    try {
      // @ts-ignore
      wasmInstance = await initWasm();
      isWasmInitialized = true;
    } catch (err) {
      ctx.postMessage({ success: false, error: "Wasm 本地沙箱环境加载失败: " + String(err) });
      return;
    }
  }

  try {
    if (type === "PARSE") {
      // 解析文件类型
      const fileExt = fileName.split(".").pop()?.toLowerCase();
      
      if (fileExt === "docx" || fileExt === "xlsx") {
        const metadataStr = scan_docx_wasm(fileBytes);
        const metadata = JSON.parse(metadataStr);
        ctx.postMessage({ success: true, type: "PARSE_SUCCESS", data: metadata, fileType: fileExt, fileName });
      } else if (fileExt === "pdf") {
        const metadataStr = scan_pdf_wasm(fileBytes);
        const metadata = JSON.parse(metadataStr);
        ctx.postMessage({ success: true, type: "PARSE_SUCCESS", data: metadata, fileType: "pdf", fileName });
      } else {
        ctx.postMessage({ success: false, error: "不支持的文件格式", fileName });
      }
    } else if (type === "PARSE_PDF_PASSWORD") {
      const metadataStr = scan_pdf_with_password_wasm(fileBytes, password);
      const metadata = JSON.parse(metadataStr);
      ctx.postMessage({ success: true, type: "PARSE_SUCCESS", data: metadata, fileType: "pdf", fileName });
    } else if (type === "CLEAN") {
      const fileExt = fileName.split(".").pop()?.toLowerCase();
      
      if (fileExt === "docx" || fileExt === "xlsx") {
        // 1. 调用 Wasm 高性能清理，返回包含裸指针和容量的 WasmBuffer
        const wasmBuffer = clean_docx_wasm(fileBytes);
        const ptr = wasmBuffer.ptr;
        const len = wasmBuffer.len;
        const cap = wasmBuffer.cap;

        try {
          // 2. 建立临时内存视图
          // @ts-ignore
          const rawView = new Uint8Array(wasmInstance.memory.buffer, ptr, len);
          // 3. 深拷贝到 JS 堆，脱离 Wasm 线性内存引用关系
          const safeJSBytes = new Uint8Array(rawView);

          // 4. 使用 Transferable 零拷贝技术转移 ArrayBuffer 所有权，极速响应且不损坏 Wasm
          ctx.postMessage(
            { success: true, type: "CLEAN_SUCCESS", data: safeJSBytes, fileName },
            [safeJSBytes.buffer]
          );
        } finally {
          // 5. 无论如何，立即同步释放 Rust 侧堆内存，杜绝堆积 OOM
          deallocate_wasm_memory(ptr, cap);
        }
      } else if (fileExt === "pdf") {
        const wasmBuffer = clean_pdf_wasm(fileBytes);
        const ptr = wasmBuffer.ptr;
        const len = wasmBuffer.len;
        const cap = wasmBuffer.cap;

        try {
          // @ts-ignore
          const rawView = new Uint8Array(wasmInstance.memory.buffer, ptr, len);
          const safeJSBytes = new Uint8Array(rawView);

          ctx.postMessage(
            { success: true, type: "CLEAN_SUCCESS", data: safeJSBytes, fileName },
            [safeJSBytes.buffer]
          );
        } finally {
          deallocate_wasm_memory(ptr, cap);
        }
      } else {
        ctx.postMessage({ success: false, error: "不支持的清理文件格式", fileName });
      }
    }
  } catch (err: any) {
    ctx.postMessage({ success: false, error: err.toString(), fileName });
  }
};
