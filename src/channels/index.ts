import BroadcastChannelBasedChannel from "./broadcast-channel";
import StorageBasedChannel from "./storage-based-channel";
import SimpleChannel from "./simple";

import type { CommunicationChannel, Listener } from "./interface";
import type { ChannelStrategy, InitOptions } from "../types";

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
	public strategy: ChannelStrategy;

	constructor(name: string, options?: InitOptions) {
		if (!name)
			throw new Error(
				"[Eazi] 'name' is required for instantiation of communication channel"
			);

		// To enable storage-based event listeners later as well for cross-tab communication
		this.strategy = options?.strategy || "broadcast-channel";

		if (
			this.strategy === "broadcast-channel" &&
			!("BroadcastChannel" in window)
		) {
			console.warn(
				"[Eazi] BroadcastChannel API not available. Falling back to storage based communication"
			);
			this.strategy = "storage";
		}

		this.mediatorImpl = new mediatorStrategyToClassMap[this.strategy](name);
	}

	// Pass-through interface functions to the eazi object
	addMessageListener = (listener: Listener) =>
		this.mediatorImpl.addMessageListener(listener);

	removeMessageListener = (listener: Listener) =>
		this.mediatorImpl.removeMessageListener(listener);

	sendMessage = (message: unknown) => this.mediatorImpl.sendMessage(message);

	close = () => this.mediatorImpl.close();
}

export default Channel;
