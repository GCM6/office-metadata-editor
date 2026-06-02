/* tslint:disable */
/* eslint-disable */

export class WasmBuffer {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    readonly cap: number;
    readonly len: number;
    readonly ptr: number;
}

/**
 * 深度剥离清理 DOCX 并执行自检和回滚机制
 */
export function clean_docx_wasm(file_bytes: Uint8Array): WasmBuffer;

/**
 * 清洗 PDF 并在内存级执行 Xref 偏移强制重算、预加载自检和保守回滚
 */
export function clean_pdf_wasm(file_bytes: Uint8Array): WasmBuffer;

export function deallocate_wasm_memory(ptr: number, cap: number): void;

/**
 * 提取 ZIP 中 core.xml 与 app.xml 的隐私值
 */
export function scan_docx_wasm(file_bytes: Uint8Array): string;

/**
 * 提取 PDF Info 字典并检测数字签名与密码保护
 */
export function scan_pdf_wasm(file_bytes: Uint8Array): string;

/**
 * 解析带有密码保护的 PDF 文件
 */
export function scan_pdf_with_password_wasm(file_bytes: Uint8Array, password: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasmbuffer_free: (a: number, b: number) => void;
    readonly clean_docx_wasm: (a: number, b: number) => [number, number, number];
    readonly clean_pdf_wasm: (a: number, b: number) => [number, number, number];
    readonly deallocate_wasm_memory: (a: number, b: number) => void;
    readonly scan_docx_wasm: (a: number, b: number) => [number, number, number, number];
    readonly scan_pdf_wasm: (a: number, b: number) => [number, number, number, number];
    readonly scan_pdf_with_password_wasm: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly wasmbuffer_cap: (a: number) => number;
    readonly wasmbuffer_len: (a: number) => number;
    readonly wasmbuffer_ptr: (a: number) => number;
    readonly deflate: (a: number, b: number) => number;
    readonly inflate: (a: number, b: number) => number;
    readonly zlibVersion: () => number;
    readonly deflateInit2_: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly deflateReset: (a: number) => number;
    readonly inflateInit2_: (a: number, b: number, c: number, d: number) => number;
    readonly inflateReset2: (a: number, b: number) => number;
    readonly deflateEnd: (a: number) => number;
    readonly inflateEnd: (a: number) => number;
    readonly inflateSetDictionary: (a: number, b: number, c: number) => number;
    readonly deflateSetDictionary: (a: number, b: number, c: number) => number;
    readonly deflateParams: (a: number, b: number, c: number) => number;
    readonly inflateReset: (a: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
