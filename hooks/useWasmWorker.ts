// useWasmWorker.ts React Hook
// 异步实例化 Web Worker 隐私计算通道，在客户端安全运行，避免 Next.js SSR 阶段发生 Window/Worker 报错。

import { useEffect, useState } from "react";

export interface WasmWorkerState {
  worker: Worker | null;
  ready: boolean;
  error: string | null;
}

export function useWasmWorker(): WasmWorkerState {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let disposed = false;
    let instance: Worker;

    try {
      // 动态载入 Worker，避免 Turbopack/Webpack 在非浏览器下解析报错
      instance = new Worker(
        new URL("../lib/workers/wasm-worker.ts", import.meta.url),
        { type: "module" }
      );
    } catch (err: any) {
      console.error("初始化 Wasm Worker 沙箱计算通道失败:", err);
      setError(err?.message || String(err));
      setReady(false);
      return;
    }

    // ready 仅在 Worker 真正完成 Wasm 初始化（WASM_READY 握手）后才置为 true，
    // 同时监听初始化错误与 Worker 运行时错误，避免“假就绪 + 永久等待”。
    const handleMessage = (e: MessageEvent) => {
      if (disposed) return;
      const data = e.data || {};
      if (data.type === "WASM_READY") {
        setError(null);
        setReady(true);
      } else if (data.type === "WASM_INIT_ERROR") {
        setError(data.error || "Wasm 初始化失败");
        setReady(false);
      }
    };

    const handleError = (e: ErrorEvent | Event) => {
      if (disposed) return;
      const message = (e as ErrorEvent)?.message || "Wasm Worker 运行时错误";
      console.error("Wasm Worker 运行时错误:", message);
      setError(message);
      setReady(false);
    };

    instance.addEventListener("message", handleMessage);
    instance.addEventListener("error", handleError);
    instance.addEventListener("messageerror", handleError);

    setWorker(instance);

    return () => {
      disposed = true;
      instance.removeEventListener("message", handleMessage);
      instance.removeEventListener("error", handleError);
      instance.removeEventListener("messageerror", handleError);
      instance.terminate();
    };
  }, []);

  return { worker, ready, error };
}
export default useWasmWorker;
