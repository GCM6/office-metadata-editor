export interface WebFileEntry {
  fileName: string
  data: Uint8Array
  fileType: string
}

export async function openWebFilePicker(accept?: string): Promise<WebFileEntry[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = accept ?? ".docx,.doc,.xlsx,.pdf"

    input.onchange = async () => {
      const {files} = input
      if (!files || files.length === 0) {
        resolve([])
        return
      }

      const entries: WebFileEntry[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file) continue
        const buffer = await file.arrayBuffer()
        const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
        entries.push({
          fileName: file.name,
          data: new Uint8Array(buffer),
          fileType: ["docx", "doc", "xlsx", "pdf"].includes(extension) ? extension : "unknown",
        })
      }

      resolve(entries)
    }

    input.oncancel = () => {
      resolve([])
    }

    input.onerror = () => {
      reject(new Error("文件选择器打开失败"))
    }

    input.click()
  })
}
