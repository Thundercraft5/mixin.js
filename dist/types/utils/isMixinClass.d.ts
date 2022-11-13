import type { Class } from "@thundercraft5/type-utils";
import type { IsMixinClassObject } from "../types";
/**
 * Checks if {@linkcode Class} is a mixin class created from this library.
 *
 * @param Class
 * @returns A boolean if {@linkcode Class} is a mixin class
 */
export default function isMixinClass<C extends Class>(Class: C): Class is IsMixinClassObject<C>;
//# sourceMappingURL=isMixinClass.d.ts.map