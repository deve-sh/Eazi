import { useEffect, useMemo } from "react";

import Channel from "../channels";
import type { InitOptions } from "../types";

// This is just a utility hook to create channels as part of the render cycle
// and takes care of cleaning them up at the end of the component lifecycle.
const useChannel = (name: string, opts: InitOptions) => {
	const channel = useMemo(() => new Channel(name, opts), []);

	useEffect(() => channel.close, []);

	return channel;
};

export default useChannel;