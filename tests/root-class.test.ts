import { Mediator } from "../src/index";

describe("Tests for root mediator class", () => {
	it("should throw error if name is not provided", () => {
		// @ts-expect-error Validating typescript errors in this test
		expect(() => new Mediator()).toThrowError(
			/'name' is required for instantiation of communication channel/i
		);
	});

	it("should have the interface properties expected from the class", () => {
		const channel = new Mediator("channel");
		expect(channel.sendMessage).not.toBeFalsy();
		expect(channel.addMessageListener).not.toBeFalsy();
		expect(channel.removeMessageListener).not.toBeFalsy();
		expect(channel.close).not.toBeFalsy();
        // @ts-expect-error Private property but accessible via JS
        expect(channel.mediatorInstance).not.toBeFalsy();
	});
});
