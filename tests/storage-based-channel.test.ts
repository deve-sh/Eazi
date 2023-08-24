import { Channel } from "../src/index";

jest.spyOn(global.console, "warn");

// In these tests we only depend on the same-tab communication
// For two reasons:
// 1. Testing cross-tab functionality requires E2E tests via a browser
// 2. Testing cross-tab functionality is not required as it builds on top of the same pattern as the same-tab functionality.
//    and the browser essentially guarantees storage events to be dispatched as required.

describe("Tests for Storage based event channel", () => {
	it("should fall back to storage events if environment doesn't support broadcast channel by default", () => {
		const consoleWarn = global.console.warn;
		let warnings: string[] = [];
		global.console.warn = (...consoleWarnings: string[]) => {
			warnings = consoleWarnings;
		};
		new Channel("channel");
		// Should give the user a warning when BroadcastChannel API is not available
		expect(warnings[0]).toMatch(
			/broadcastchannel api not available. falling back to storage based communication/i
		);
		global.console.warn = consoleWarn;
	});

	it("should use localStorage as the storage driver by default", () => {
		const channel = new Channel("channel", { strategy: "storage" });
		// @ts-expect-error Private property but accessible via JS tests
		expect(channel.mediatorImpl.storageDriver).toBe(localStorage);
	});

	it("should be able to communicate between channels via storage events", () => {
		const channel1 = new Channel("channel", { strategy: "storage" });
		const channel2 = new Channel("channel", { strategy: "storage" });
		const channel3 = new Channel("channel", { strategy: "storage" });

		let receivedData: unknown = null;
		const receiverFunction = (data: unknown) => {
			receivedData = data;
		};
		channel2.addMessageListener(receiverFunction);
		channel1.sendMessage("Message from channel 1");
		expect(receivedData).toEqual("Message from channel 1");
		channel3.sendMessage("Message from channel 3");
		expect(receivedData).toEqual("Message from channel 3");
		// Avoid listener leaks by closing channels when not in use anymore
		channel2.close();
		channel3.close();
		channel1.close();
	});

	it("should remove message listeners", () => {
		const channel1 = new Channel("channel", { strategy: "storage" });
		const channel2 = new Channel("channel", { strategy: "storage" });

		let receivedData: unknown = null;
		const receiverFunction = (data: unknown) => {
			receivedData = data;
		};
		channel2.addMessageListener(receiverFunction);
		channel1.sendMessage("Message from channel 1");
		expect(receivedData).toEqual("Message from channel 1");
		channel2.removeMessageListener(receiverFunction);
		channel1.sendMessage("Message again");
		// Should not have changed
		expect(receivedData).toEqual("Message from channel 1");
		channel2.close();
		channel1.close();
	});

	it("should deduplicate events and not trigger listeners on the emitter", () => {
		const channel1 = new Channel("channel", { strategy: "storage" });
		const channel2 = new Channel("channel", { strategy: "storage" });

		let receivedDataAtChannel1 = null;
		let receivedData = null;
		channel2.addMessageListener((data) => {
			receivedData = data;
		});
		channel1.addMessageListener((data) => {
			receivedDataAtChannel1 = data;
		});
		channel1.sendMessage("Message from channel 1");
		expect(receivedData).toEqual("Message from channel 1");
		expect(receivedDataAtChannel1).toEqual(null);
		channel2.sendMessage("Message from channel 2");
		expect(receivedDataAtChannel1).toEqual("Message from channel 2");
		channel2.close();
		channel1.close();
	});
});
