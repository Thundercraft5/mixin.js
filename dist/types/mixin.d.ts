import type { Class } from "@thundercraft5/type-utils";
import type { AbstractConstructor } from "@thundercraft5/type-utils/constructors";
import type { MixinClass } from "./types";
/**
 * Creates a mixin class with {@linkcode Base} as the base, with {@linkcode classes} as mixins.
 * Workaround for mixins with generic parameters.
 *
 * **Usage Notes**:
 * - Does not return the mixins from {@linkcode classes}, due to *direct* inheritance constraints of typescript.
 * - To achieve inheritance with generics, create a interface with the same signature as the class you are creating.
 * @see {Mixin}
 * @see {MixinConstructor}
 * @param Base The base class to extend
 * @param classes The classes to add to the base as mixins
 * @returns A class with {@linkcode Base} as the base class and {@linkcode classes} added as mixins
 */
export declare function GenericMixin<Base extends AbstractConstructor, Classes extends Class[] = []>(Base: Base, ...classes: [...Classes]): Base & {
    readonly [Symbol.mixin]: true;
};
/**
 * Creates a mixin class for a given class as the base and additional classes as mixins.
 *
 * **Usage Notes:**
 * - Only the base class can be instantiated with generics. Use {@linkcode GenericMixin} and declaration merging to achieve generic instantiation for all classes.
 *
 * @see {MixinClass}
 * @see {GenericMixin}
 * @param Base The base class to extend
 * @param classes The classes to add to the base as mixins
 * @returns A class with {@linkcode Base} as the base class and {@linkcode classes} added as mixins
 */
export declare function Mixin<Base extends AbstractConstructor = typeof Object, Classes extends Class[] = []>(Base: Base, ...classes: [...Classes]): MixinClass<Base, Classes>;
//# sourceMappingURL=mixin.d.ts.map