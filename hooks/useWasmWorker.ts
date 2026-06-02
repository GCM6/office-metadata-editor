// useWasmWorker.ts React Hook
// 异步实例化 Web Worker 隐私计算通道，在客户端安全运行，避免 Next.js SSR 阶段发生 Window/Worker 报错。

import { useEffect, useRef, useState } from "react";

export interface WasmWorkerState {
  worker: Worker | null;
  ready: boolean;
  error: string | null;
}

export function useWasmWorker(): WasmWorkerState {
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 动态载入 Worker，避免 Turbopack/Webpack 在非浏览器下解析报错
      const worker = new Worker(
        new URL("../lib/workers/wasm-worker.ts", import.meta.url),
        { type: "module" }
      );

      workerRef.current = worker;
      setReady(true);
    } catch (err: any) {
      console.error("初始化 Wasm Worker 沙箱计算通道失败:", err);
      setError(err.message || String(err));
      setReady(false);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return { worker: workerRef.current, ready, error };
}
export default useWasmWorker;
