export type NativeListener = (event: MessageEvent) => void;

export type Listener = (
	eventData?: MessageEvent["data"],
	event?: MessageEvent
) => void;

export interface CommunicationManager {
	addMessageListener: (listener: Listener) => unknown;
	removeMessageListener: (listener: Listener) => unknown;
	sendMessage: (message: unknown) => unknown;
	close: () => unknown; // Closes listeners and connections to current event bridge
}
