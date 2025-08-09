// types/global.d.ts
export {};

declare global {
  interface Window {
    fbq?: (
      command: string,
      eventName: string,
      eventData?: Record<string, unknown>
    ) => void;
    _pendingFbEvents: {
      eventName: string;
      eventData?: Record<string, unknown>;
    }[];
  }
}
