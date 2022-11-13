/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { SymbolMixin } from "../symbols";

import type { Class } from "@thundercraft5/type-utils";
import type { IsMixinClassObject } from "../types";

/**
 * Checks if {@linkcode Class} is a mixin class created from this library.
 * 
 * @param Class 
 * @returns A boolean if {@linkcode Class} is a mixin class
 */
export default function isMixinClass<C extends Class>(Class: C): Class is IsMixinClassObject<C> {
	return typeof Class === "object" && Class !== null && SymbolMixin in Class!;
}