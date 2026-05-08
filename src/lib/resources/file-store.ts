const fileStore = new Map<string, Uint8Array>()

export function setFileData(key: string, data: Uint8Array): void {
  fileStore.set(key, data)
}

export function getFileData(key: string): Uint8Array | undefined {
  return fileStore.get(key)
}

export function hasFileData(key: string): boolean {
  return fileStore.has(key)
}

export function deleteFileData(key: string): void {
  fileStore.delete(key)
}

export function clearFileStore(): void {
  fileStore.clear()
}
