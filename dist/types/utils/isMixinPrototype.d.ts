import type { IsMixinPrototype } from "../types";
/**
 * Checks if {@linkcode prototype} is a mixin class prototype created from this library.
 *
 * @param Class
 * @returns A boolean if {@linkcode prototype} is a mixin class prototype
 */
export default function isMixinPrototype<P extends object>(prototype: P): prototype is IsMixinPrototype<P>;
//# sourceMappingURL=isMixinPrototype.d.ts.map