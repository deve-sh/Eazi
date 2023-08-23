import { useEffect, useMemo } from "react";

import Mediator from "../mediators";
import type { InitOptions } from "../types";

// This is just a utility hook to create mediators as part of the render cycle
// and takes care of cleaning them up at the end of the component lifecycle.
const useMediator = (name: string, opts: InitOptions) => {
	const mediator = useMemo(() => new Mediator(name, opts), []);

	useEffect(() => mediator.close, []);

	return mediator;
};

export default useMediator;