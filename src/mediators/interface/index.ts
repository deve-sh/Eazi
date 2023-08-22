export type Listener = (event: MessageEvent) => void;

export interface CommunicationManager {
  onMessage: (listener: Listener) => unknown;
  removeListener: (listener: Listener) => unknown;
  sendMessage: (message: unknown) => unknown;
  close: () => unknown; // Closes listeners and connections to current event bridge
}
