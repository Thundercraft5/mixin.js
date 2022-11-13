import mixinInstanceOf from "./mixinInstanceOf";

import type { Class } from "@thundercraft5/type-utils";

export default function makeInstanceOf<T extends Class>(type: T) {
	return (target: any): target is InstanceType<T> => mixinInstanceOf(target, type);
}