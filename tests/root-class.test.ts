import { Channel } from "../src/index";

describe("Tests for root eazi class", () => {
	it("should throw error if name is not provided", () => {
		// @ts-expect-error Validating typescript errors in this test
		expect(() => new Channel()).toThrowError(
			/'name' is required for instantiation of communication channel/i
		);
	});

	it("should have the interface properties expected from the class", () => {
		const channel = new Channel("channel");
		expect(channel.sendMessage).not.toBeFalsy();
		expect(channel.addMessageListener).not.toBeFalsy();
		expect(channel.removeMessageListener).not.toBeFalsy();
		expect(channel.close).not.toBeFalsy();
        // @ts-expect-error Private property but accessible via JS
        expect(channel.mediatorImpl).not.toBeFalsy();
	});
});
