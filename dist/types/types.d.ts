import { SymbolMixinConstruct } from "./symbols";
import type { SymbolIsMixinClass, SymbolIsMixinPrototype, SymbolMixinClasses } from "./symbols";
import type { Class } from "@thundercraft5/type-utils";
import type { ReverseTuple, TupleToIntersection } from "@thundercraft5/type-utils/arrays";
import type { AbstractConstructor } from "@thundercraft5/type-utils/constructors";
import type { AbstractFunction } from "@thundercraft5/type-utils/functions";
type Proto<O extends any[]> = O extends [infer C, ...infer R] ? [C extends {
    prototype: infer P;
} ? P : never, ...Proto<R>] : [];
type OmitConstructor<C> = C extends AbstractFunction<infer R, infer A> ? AbstractFunction<R, A> & {
    [K in Exclude<keyof C, "prototype">]: C[K];
} : {
    [K in Exclude<keyof C, "prototype">]: C[K];
};
type Instances<O extends any[]> = O extends [infer C extends AbstractConstructor, ...infer R] ? [C extends AbstractConstructor<infer T> ? T : never, ...Proto<R>] : [];
/**
 * Converts a Base class and other classes into a mixin class
 *
 * **Usage Notes:**
 * - {@linkcode Classes} are reversed to stay in sync with {@linkcode Mixin} method resolution order
 * - Mixin methods take precedence over base class methods
 * - The last class the list in the list wins in case of method conflict
 * - Only the base class can have propagated type parameters (For a workaround, use declaration merging with an interface that has the same signature as the base class)
 */
export type MixinClass<Base extends Class, Classes extends Class[]> = {
    new (...args: any[]): TupleToIntersection<ReverseTuple<[...Instances<Classes>]>>;
    readonly [SymbolIsMixinClass]: true;
    readonly [SymbolMixinClasses]: Classes;
    prototype: TupleToIntersection<ReverseTuple<[...Instances<Classes>]>> & InstanceType<Base> & {
        readonly [SymbolIsMixinPrototype]?: true;
    };
} & OmitConstructor<TupleToIntersection<ReverseTuple<[...Classes]>>> & Base;
/**
 * Workaround type for classes that have generics, generic instance types are added via declaration merging in classes
 * @see {@linkcode MixinClass}
 */
export type GenericMixinClass<Base extends Class, Classes extends Class[]> = Base & {
    readonly [SymbolIsMixinClass]: true;
    readonly [SymbolMixinClasses]: Classes;
    prototype: TupleToIntersection<ReverseTuple<[...Instances<Classes>]>> & InstanceType<Base> & {
        readonly [SymbolIsMixinPrototype]: true;
    };
} & OmitConstructor<TupleToIntersection<ReverseTuple<[...Classes]>>>;
export type IsMixinClassObject<C extends Class = Class> = C extends Class & {
    readonly [SymbolIsMixinClass]: true;
    prototype: {
        readonly [SymbolIsMixinPrototype]: true;
    };
} ? C : never;
export type IsMixinPrototype<P> = P extends {
    readonly [SymbolIsMixinClass]: true;
} ? P : never;
export type HasMixinClass<M extends MixinClassObject, C extends Class> = M;
export type MixinPrototype<M extends Class> = M extends IsMixinClassObject<M> ? M["prototype"] : never;
export type MixinClassObject = Class & {
    readonly [SymbolIsMixinClass]: true;
    prototype: {
        readonly [SymbolIsMixinPrototype]: true;
    };
};
export type MixinConstructable = Class & {
    [SymbolMixinConstruct]?(...args: any[]): any;
};
export {};
//# sourceMappingURL=types.d.ts.map