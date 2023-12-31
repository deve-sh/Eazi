// Storage events based eazi, for times when BroadcastChannel isn't available
import type { CommunicationChannel, Listener } from "../interface";

class StorageBasedChannel implements CommunicationChannel {
	storagePartitionId: string;
	storageDriver: Storage = window.localStorage;
	listeners: Set<Listener> = new Set();
	deduplicationId = performance.now().toString();

	private onStorageEvent = (event: StorageEvent) => {
		if (event.storageArea != this.storageDriver) return;
		if (event.key !== this.storagePartitionId) return; // Not our event channel
		if (event.oldValue && !event.newValue) return; // Deletion event, would be triggered by us

		// We use the url field as the dedupe id in case of a synthetically generated event from this class itself
		// To ensure this class's storage event listener doesn't end up listening to itself.
		const eventDedupeId = event?.url;
		if (eventDedupeId && eventDedupeId === this.deduplicationId) return;

		for (const listener of this.listeners) {
			const data = event["newValue"] ? JSON.parse(event["newValue"]) : null;
			listener(data, event);
		}
	};

	constructor(name: string) {
		this.storagePartitionId = name;
		window.addEventListener("storage", this.onStorageEvent);
	}

	sendMessage = (message: unknown) => {
		// Sends a message to all the other tabs
		let serializedValue = "";
		try {
			serializedValue = JSON.stringify(message);
		} catch {}

		this.storageDriver.setItem(this.storagePartitionId, serializedValue);
		// Dispatch storage event
		window.dispatchEvent(
			new StorageEvent("storage", {
				newValue: serializedValue,
				key: this.storagePartitionId,
				storageArea: this.storageDriver,
				url: this.deduplicationId,
			})
		);
		// Immediately remove item from storage
		this.storageDriver.removeItem(this.storagePartitionId);
	};

	addMessageListener = (listener: Listener) => {
		this.listeners.add(listener);
	};

	removeMessageListener = (listener: Listener) => {
		this.listeners.delete(listener);
	};

	close = () => {
		window.removeEventListener("storage", this.onStorageEvent);
	};
}

export default StorageBasedChannel;
