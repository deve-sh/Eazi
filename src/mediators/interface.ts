export type NativeListener<EventType = MessageEvent> = (
	event: EventType
) => void;

export type Listener = (
	eventData?: MessageEvent["data"] | unknown,
	event?: MessageEvent | StorageEvent
) => void;

export interface CommunicationMediator {
	addMessageListener: (listener: Listener) => unknown;
	removeMessageListener: (listener: Listener) => unknown;
	sendMessage: (message: unknown) => unknown;
	close: () => unknown; // Closes listeners and connections to current event bridge
}
