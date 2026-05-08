import { BrowserRouter, Routes, Route } from "react-router-dom"

import { FileProvider } from "./contexts/file-context"
import { MetadataProvider } from "./contexts/metadata-context"
import { ChromeThemeSync } from "./components/chrome/chrome-theme-sync"
import { EditorPage } from "./pages/editor-page"
import { HomePage } from "./pages/home-page"
import { BatchPage } from "./pages/batch-page"

export default function App() {
  return (
    <FileProvider>
      <MetadataProvider>
        <BrowserRouter>
          <ChromeThemeSync />
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="/batch" element={<BatchPage />} />
          </Routes>
        </BrowserRouter>
      </MetadataProvider>
    </FileProvider>
  )
}
