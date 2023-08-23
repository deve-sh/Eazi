// Broadcast Channel based Event Bridge
import type {
	CommunicationMediator,
	Listener,
	NativeListener,
} from "../interface";

class BroadcastChannelBasedMediator implements CommunicationMediator {
	broadcastChannelId: string;
	broadcastChannel: BroadcastChannel;
	listeners: Map<Listener, NativeListener> = new Map();

	constructor(name: string) {
		this.broadcastChannelId = name;
		this.broadcastChannel = new BroadcastChannel(this.broadcastChannelId);
	}

	sendMessage = (message: unknown) => {
		this.broadcastChannel.postMessage(message);
	};

	addMessageListener = (listener: Listener) => {
		const associatedListener: NativeListener = (event) => {
			listener((event as MessageEvent).data, event);
		};
		this.listeners.set(listener, associatedListener);
		this.broadcastChannel.addEventListener("message", associatedListener);
	};

	removeMessageListener = (listener: Listener) => {
		this.broadcastChannel.removeEventListener(
			"message",
			this.listeners.get(listener) as NativeListener
		);
		this.listeners.delete(listener);
	};

	close = () => {
		for (let [, associatedListener] of this.listeners)
			this.broadcastChannel.removeEventListener("message", associatedListener);
		this.listeners = new Map();
	};
}

export default BroadcastChannelBasedMediator;
