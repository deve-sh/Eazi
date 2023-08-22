import BroadcastChannelBasedMediator from "./broadcast-channel";

import type { CommunicationManager, Listener } from "./interface";

class Mediator implements CommunicationManager {
	private mediatorInstance: BroadcastChannelBasedMediator;

	constructor(name: string) {
		// To enable storage-based event listeners later as well for cross-tab communication
		this.mediatorInstance = new BroadcastChannelBasedMediator(name);
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
