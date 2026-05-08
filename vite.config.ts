import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isWebMode = mode === "web" || process.env.VITE_BUILD_TARGET === "web"

  return {
    base: isWebMode ? "./" : "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 1420,
      strictPort: true,
    },
    build: isWebMode
      ? {
          outDir: "dist-web",
        }
      : undefined,
  }
})
