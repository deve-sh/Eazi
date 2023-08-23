// No cross-tab communication mediator
import { v4 as uuid } from "uuid";
import type {
	CommunicationMediator,
	Listener,
	NativeListener,
} from "../interface";

const MEDIATOR_SAME_TAB_EVENT_NAME = "[mediator]communication-event";

class SimpleMediator implements CommunicationMediator {
	listeners: Map<Listener, NativeListener> = new Map();
	deduplicationId = uuid();

	constructor() {}

	sendMessage = (message: unknown) => {
		window.dispatchEvent(
			new MessageEvent(MEDIATOR_SAME_TAB_EVENT_NAME, {
				data: { message, metadata: { dedupeId: this.deduplicationId } },
			})
		);
	};

	addMessageListener = (listener: Listener) => {
		const associatedListener: NativeListener = (event) => {
			const dedupeId = event.data?.metadata?.dedupeId;
			if (event.data?.metadata?.dedupeId && dedupeId === this.deduplicationId)
				return;

			listener((event as MessageEvent).data, event);
		};
		this.listeners.set(listener, associatedListener);
		// @ts-expect-error We are creating a new event for our event channel to listen to that doesn't interfere with the rest of the DOM
		window.addEventListener(MEDIATOR_SAME_TAB_EVENT_NAME, associatedListener);
	};

	removeMessageListener = (listener: Listener) => {
		window.removeEventListener(
			"message",
			this.listeners.get(listener) as NativeListener
		);
		this.listeners.delete(listener);
	};

	close = () => {
		for (const [, associatedListener] of this.listeners) {
			// @ts-expect-error We are creating a new event for our event channel to listen to that doesn't interfere with the rest of the DOM
			window.removeEventListener(
				MEDIATOR_SAME_TAB_EVENT_NAME,
				associatedListener
			);
		}
		this.listeners = new Map();
	};
}

export default SimpleMediator;
