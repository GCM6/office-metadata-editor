// Mock libz-sys 导出以使 Cargo 编译通过。
// 因为我们强制使用了 `--cfg flate2_backend="rust_backend"`，
// flate2 运行时不会调用任何 libz-sys 的 C 语言绑定符号。

pub type c_int = i32;
pub type c_uint = u32;
pub type c_ulong = u32;
pub type uInt = u32;
pub type uLong = u32;
pub type voidpf = *mut std::ffi::c_void;
pub type voidp = *mut std::ffi::c_void;
pub type charp = *mut i8;

#[repr(C)]
#[allow(non_camel_case_types)]
pub struct z_stream {
    pub next_in: *mut u8,
    pub avail_in: uInt,
    pub total_in: uLong,
    pub next_out: *mut u8,
    pub avail_out: uInt,
    pub total_out: uLong,
    pub msg: charp,
    pub state: *mut std::ffi::c_void,
    pub zalloc: unsafe extern "C" fn(voidpf, uInt, uInt) -> voidpf,
    pub zfree: unsafe extern "C" fn(voidpf, voidpf),
    pub opaque: voidpf,
    pub data_type: c_int,
    pub adler: uLong,
    pub reserved: uLong,
}

// 常见的 zlib 常量
pub const Z_OK: c_int = 0;
pub const Z_STREAM_END: c_int = 1;
pub const Z_NEED_DICT: c_int = 2;
pub const Z_ERRNO: c_int = -1;
pub const Z_STREAM_ERROR: c_int = -2;
pub const Z_DATA_ERROR: c_int = -3;
pub const Z_MEM_ERROR: c_int = -4;
pub const Z_BUF_ERROR: c_int = -5;
pub const Z_VERSION_ERROR: c_int = -6;

pub const Z_NO_COMPRESSION: c_int = 0;
pub const Z_BEST_SPEED: c_int = 1;
pub const Z_BEST_COMPRESSION: c_int = 9;
pub const Z_DEFAULT_COMPRESSION: c_int = -1;

pub const Z_FILTERED: c_int = 1;
pub const Z_HUFFMAN_ONLY: c_int = 2;
pub const Z_RLE: c_int = 3;
pub const Z_FIXED: c_int = 4;
pub const Z_DEFAULT_STRATEGY: c_int = 0;

pub const Z_NO_FLUSH: c_int = 0;
pub const Z_PARTIAL_FLUSH: c_int = 1;
pub const Z_SYNC_FLUSH: c_int = 2;
pub const Z_FULL_FLUSH: c_int = 3;
pub const Z_FINISH: c_int = 4;
pub const Z_BLOCK: c_int = 5;
pub const Z_TREES: c_int = 6;

pub const Z_BINARY: c_int = 0;
pub const Z_TEXT: c_int = 1;
pub const Z_ASCII: c_int = Z_TEXT;
pub const Z_UNKNOWN: c_int = 2;

pub const Z_DEFLATED: c_int = 8;

#[no_mangle]
pub unsafe extern "C" fn deflateInit2_(
    _strm: *mut z_stream,
    _level: c_int,
    _method: c_int,
    _windowBits: c_int,
    _memLevel: c_int,
    _strategy: c_int,
    _version: *const u8,
    _stream_size: c_int,
) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn deflate(_strm: *mut z_stream, _flush: c_int) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn deflateEnd(_strm: *mut z_stream) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn deflateReset(_strm: *mut z_stream) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn deflateSetDictionary(_strm: *mut z_stream, _dictionary: *const u8, _dictLength: uInt) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn deflateParams(_strm: *mut z_stream, _level: c_int, _strategy: c_int) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn inflateInit2_(_strm: *mut z_stream, _windowBits: c_int, _version: *const u8, _stream_size: c_int) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn inflate(_strm: *mut z_stream, _flush: c_int) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn inflateEnd(_strm: *mut z_stream) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn inflateReset(_strm: *mut z_stream) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn inflateReset2(_strm: *mut z_stream, _windowBits: c_int) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn inflateSetDictionary(_strm: *mut z_stream, _dictionary: *const u8, _dictLength: uInt) -> c_int { 0 }

#[no_mangle]
pub unsafe extern "C" fn zlibVersion() -> *const u8 { b"1.2.11\0".as_ptr() }
