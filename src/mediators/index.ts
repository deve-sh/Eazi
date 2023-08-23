import BroadcastChannelBasedMediator from "./broadcast-channel";
import StorageBasedMediator from "./storage-based-channel";
import SimpleMediator from "./simple";

import type { CommunicationMediator, Listener } from "./interface";

type MediatorStrategy = "storage" | "broadcast-channel" | "simple";
type InitOptions = { strategy: MediatorStrategy };

const mediatorStrategyToClassMap = {
	"broadcast-channel": BroadcastChannelBasedMediator,
	storage: StorageBasedMediator,
	simple: SimpleMediator,
} as const;

class Mediator implements CommunicationMediator {
	private mediatorInstance:
		| BroadcastChannelBasedMediator
		| StorageBasedMediator
		| SimpleMediator;

	constructor(name: string, options: InitOptions) {
		if (!name)
			throw new Error(
				"[Mediator] 'name' is required for instantiation of communication channel"
			);

		// To enable storage-based event listeners later as well for cross-tab communication
		let mediatorStrategy = options.strategy || "broadcast-channel";

		if (
			mediatorStrategy === "broadcast-channel" &&
			!("BroadcastChannel" in window)
		) {
			console.warn(
				"[Mediator] BroadcastChannel API not available. Falling back to storage based communication"
			);
			mediatorStrategy = "storage";
		}

		this.mediatorInstance = new mediatorStrategyToClassMap[mediatorStrategy](
			name
		);
	}

	// Pass-through interface functions to the mediator object
	addMessageListener = (listener: Listener) =>
		this.mediatorInstance.addMessageListener(listener);

	removeMessageListener = (listener: Listener) =>
		this.mediatorInstance.removeMessageListener(listener);

	sendMessage = (message: unknown) =>
		this.mediatorInstance.sendMessage(message);

	close = () => this.mediatorInstance.close();
}

export default Mediator;
