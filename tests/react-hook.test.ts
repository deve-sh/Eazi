import { renderHook } from "@testing-library/react-hooks";

import { useChannel } from "../src/react";

describe("useChannel react hook", () => {
	test("should expose the properties of a regular channel interface", () => {
		const { result } = renderHook(() => useChannel("events-channel"));

		const channel = result.current;
		expect(channel.sendMessage).not.toBeFalsy();
		expect(channel.addMessageListener).not.toBeFalsy();
		expect(channel.removeMessageListener).not.toBeFalsy();
		expect(channel.close).not.toBeFalsy();
		// @ts-expect-error Private property but accessible via JS
		expect(channel.mediatorImpl).not.toBeFalsy();
	});

	test("should honour user's strategy passed via the second arg", () => {
		let channel = renderHook(() => useChannel("events-channel")).result.current;
		// Since broadcast channel isn't available as part of the jest test environment. expect it to fall back to storage based events
		expect(channel.strategy).toBe("storage");

		channel = renderHook(() =>
			useChannel("events-channel", { strategy: "simple" })
		).result.current;
        expect(channel.strategy).toBe("simple");
	});
});
