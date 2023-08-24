import BroadcastChannelBasedChannel from "./broadcast-channel";
import StorageBasedChannel from "./storage-based-channel";
import SimpleChannel from "./simple";

import type { CommunicationChannel, Listener } from "./interface";
import type { InitOptions } from "../types";

const mediatorStrategyToClassMap = {
	"broadcast-channel": BroadcastChannelBasedChannel,
	storage: StorageBasedChannel,
	simple: SimpleChannel,
} as const;

class Channel implements CommunicationChannel {
	private mediatorImpl:
		| BroadcastChannelBasedChannel
		| StorageBasedChannel
		| SimpleChannel;

	constructor(name: string, options?: InitOptions) {
		if (!name)
			throw new Error(
				"[Eazi] 'name' is required for instantiation of communication channel"
			);

		// To enable storage-based event listeners later as well for cross-tab communication
		let mediatorStrategy = options?.strategy || "broadcast-channel";

		if (
			mediatorStrategy === "broadcast-channel" &&
			!("BroadcastChannel" in window)
		) {
			console.warn(
				"[Eazi] BroadcastChannel API not available. Falling back to storage based communication"
			);
			mediatorStrategy = "storage";
		}

		this.mediatorImpl = new mediatorStrategyToClassMap[mediatorStrategy](
			name
		);
	}

	// Pass-through interface functions to the eazi object
	addMessageListener = (listener: Listener) =>
		this.mediatorImpl.addMessageListener(listener);

	removeMessageListener = (listener: Listener) =>
		this.mediatorImpl.removeMessageListener(listener);

	sendMessage = (message: unknown) =>
		this.mediatorImpl.sendMessage(message);

	close = () => this.mediatorImpl.close();
}

export default Channel;
