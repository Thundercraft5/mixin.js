/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { staticMixinMap } from "../weakMaps";

import type { Class } from "@thundercraft5/type-utils";

export default function mixinInstanceOf<T extends Class>(target: any, type: T): target is InstanceType<T> {
	if (staticMixinMap.has(type) && staticMixinMap.get(type).has(target))
		return true;

	return false;
}