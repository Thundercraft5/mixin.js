/* eslint-disable @typescript-eslint/sort-type-union-intersection-members */
import type { Class } from "@thundercraft5/type-utils";
import type { ReverseTuple, TupleToIntersection } from "@thundercraft5/type-utils/arrays";
import type { AbstractConstructor } from "@thundercraft5/type-utils/constructors";
import type { AbstractFunction } from "@thundercraft5/type-utils/functions";

type Proto<O extends any[]> = O extends [infer C, ...infer R]
	? [C extends { prototype: infer P } ? P : never, ...Proto<R>]
	: [];

type OmitConstructor<C> = C extends AbstractFunction<infer R, infer A> ? AbstractFunction<R, A> & {
	[K in Exclude<keyof C, "prototype">]: C[K]
} : { [K in Exclude<keyof C, "prototype">]: C[K] };

type Instances<O extends any[]> = O extends [infer C extends AbstractConstructor, ...infer R]
	? [C extends AbstractConstructor<infer T> ? T : never, ...Proto<R>]
	: [];
type KeyofExcept<O, E> = Exclude<keyof O, E>;

type GetNew<O> = O extends { new: infer N } ? N : never;

/**
 * Converts a Base class and other classes into a mixin class
 * 
 * **Usage Notes:**
 * - {@linkcode Classes} are reversed to stay in sync with {@linkcode Mixin} method resolution order
 * - Mixin methods take precedence over base class methods
 * - The last class the list in the list wins in case of method conflict
 * - Only the base class can have propagated type parameters (For a workaround, use declaration merging with an interface that has the same signature as the base class)
 */
export type MixinClass<Base extends Class, Classes extends Class[]> =
	& {
		new(...args: any[]): TupleToIntersection<ReverseTuple<[...Instances<Classes>]>>;
		prototype: TupleToIntersection<ReverseTuple<[...Instances<Classes>]>> & InstanceType<Base> & {
			readonly [Symbol.mixinPrototype]: true;
		};
	}
	& OmitConstructor<TupleToIntersection<ReverseTuple<[...Classes]>>>
	& Base
	& {
		readonly [Symbol.mixin]: true;
	};

// Workaround for classes that have generics, generics are created via declaration merging in classes
export type GenericMixinClass<Base extends Class, Class extends Class[]> = Base & { readonly [Symbol.mixin]: true } & {
	prototype: {
		readonly [Symbol.mixinPrototype]: true;
	};
};

export type IsMixinClassObject<C extends Class = Class> = C extends Class & {
	readonly [Symbol.mixin]: true;
	prototype: {
		readonly [Symbol.mixinPrototype]: true;
	};
} ? C : never;
export type IsMixinPrototype<P> = P extends {
	readonly [Symbol.mixinPrototype]: true;
} ? P : never;
export type MixinPrototype<M extends Class> = M extends IsMixinClassObject<M> ? M["prototype"] : never;
export type MixinClassObject = Class & {
	readonly [Symbol.mixin]: true;
	prototype: {
		readonly [Symbol.mixinPrototype]: true;
	};
};
export type MixinConstructable = Class & { [Symbol.mixinConstruct]?(...args: any[]): any };