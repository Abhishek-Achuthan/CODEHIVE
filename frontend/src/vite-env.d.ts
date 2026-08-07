/// <reference types="vite/client" />

// ─── Jitsi Meet External API ────────────────────────────────────────────────

/** Minimal surface of the Jitsi Meet External API instance used in this app. */
interface JitsiMeetExternalAPIInstance {
  addListener(event: string, listener: (...args: unknown[]) => void): void;
  removeListener(event: string, listener: (...args: unknown[]) => void): void;
  executeCommand(command: string, ...args: unknown[]): void;
  dispose(): void;
}

/** Constructor type injected by the Jitsi external_api.js script. */
interface JitsiMeetExternalAPIConstructor {
  new (domain: string, options?: Record<string, unknown>): JitsiMeetExternalAPIInstance;
}

// ─── UMD module-loader globals (temporarily nulled during Jitsi script load) ─

/**
 * AMD `define` function — present when RequireJS / webpack AMD runtime is active.
 * Typed loosely because the exact signature varies across loaders.
 */
interface AmdDefine {
  (...args: unknown[]): void;
  amd?: Record<string, unknown>;
}

/** CommonJS-style `exports` object present in some bundler environments. */
type CjsExports = Record<string, unknown>;

// ─── Window augmentation ─────────────────────────────────────────────────────

interface Window {
  /** Populated by the dynamically loaded Jitsi external_api.js script. */
  JitsiMeetExternalAPI?: JitsiMeetExternalAPIConstructor;
  /** AMD define — may be present due to Monaco or other loaders. */
  define?: AmdDefine;
  /** CommonJS exports shim that some bundlers expose on window. */
  exports?: CjsExports;
}
