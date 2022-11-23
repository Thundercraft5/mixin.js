import { mixinClassMap } from "../weakMaps";

import type { Class } from "@thundercraft5/type-utils";

export default function mixinInstanceOf<T extends Class>(target: any, type: T): target is InstanceType<T> {
	if (mixinClassMap.has(type) && mixinClassMap.get(type)!.has(target))
		return true;

	return false;
}