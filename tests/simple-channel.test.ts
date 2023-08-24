import { Channel } from "../src/index";

describe("Tests for Simple no-cross-tab communication based event channel", () => {
	it("should be able to communicate between channels via storage events", () => {
		const channel1 = new Channel("channel", { strategy: "simple" });
		const channel2 = new Channel("channel", { strategy: "simple" });

		let receivedData = null;
		channel2.addMessageListener((data) => {
			receivedData = data;
		});
		channel1.sendMessage("Message from channel 1");
		expect(receivedData).toEqual("Message from channel 1");
		channel2.close();
		channel1.close();
	});

	it("should deduplicate events and not trigger listeners on the emitter", () => {
		const channel1 = new Channel("channel", { strategy: "simple" });
		const channel2 = new Channel("channel", { strategy: "simple" });

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
