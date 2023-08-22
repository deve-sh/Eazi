// Broadcast Channel based Event Bridge

import { v4 as uuid } from "uuid";
import type {
	CommunicationManager,
	Listener,
	NativeListener,
} from "../interface";

class BroadcastChannelBasedMediator implements CommunicationManager {
	broadcastChannelId: string;
	broadcastChannel: BroadcastChannel;
	listeners: Map<Listener, NativeListener> = new Map();

	constructor(name: string) {
		this.broadcastChannelId = name || uuid();
		this.broadcastChannel = new BroadcastChannel(this.broadcastChannelId);
	}

	sendMessage(message: unknown) {
		this.broadcastChannel.postMessage(message);
	}

	addMessageListener(listener: Listener) {
		const associatedListener: NativeListener = (event) => {
			listener(event.data, event);
		};
		this.listeners.set(listener, associatedListener);
		this.broadcastChannel.addEventListener("message", associatedListener);
	}

	removeMessageListener(listener: Listener) {
		this.broadcastChannel.removeEventListener(
			"message",
			this.listeners.get(listener) as NativeListener
		);
	}

	close() {
		this.broadcastChannel.close();
	}
}

export default BroadcastChannelBasedMediator;
