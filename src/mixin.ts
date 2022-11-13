/* eslint-disable @typescript-eslint/no-unsafe-member-access, func-style, unicorn/consistent-function-scoping, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-use-before-define, @typescript-eslint/no-redeclare */
import { mixinPrototypeMap, staticMixinMap, staticMixinProtoMap } from "./weakMaps";
import { SymbolMixinConstruct, SymbolMixinPrototype } from "./symbols";

import { makeInstanceOf } from "./utils";

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
export function GenericMixin<
	Base extends AbstractConstructor,
	Classes extends Class[] = [],
>(Base: Base, ...classes: [...Classes]): Base & { readonly [Symbol.mixin]: true } {
	return Mixin(Base, ...classes);
}

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
export function Mixin<
	Base extends AbstractConstructor = typeof Object,
	Classes extends Class[] = [],
>(Base: Base, ...classes: [...Classes]) {
	const baseMixin = function() {},
		basePrototype = Base.prototype,
		name = `${ Base.name } (${ classes.map(Class => Class.name).join(", ") })`;

	baseMixin.prototype = basePrototype;
	Object.defineProperty(baseMixin, "name", { value: name, enumerable: false });

	staticMixinProtoMap.set(baseMixin, Base.prototype);

	/**
	 * Create a mixin class, which is acts as a intermediary between the child and base class and mixins
	 * Mixins have [Symbol.hasInstance]() builtin to them alongside a property called [Symbol.mixin] that identifies it as a base mixin proxy
	 */
	const mixinClass = new Proxy(baseMixin, {
			get(target, key) {
				if (key === Symbol.hasInstance)
					return instanceOf;

				return key === "prototype"
					? mixinPrototypeObject
					: Reflect.get(target, key);
			},

			set(target, key, value) {
				if (key === "prototype" || key === Symbol.hasInstance)
					return false;

				return Reflect.set(target, key, value);
			},

			has(target, key) {
				if (key === "prototype")
					return true;
				if (key === Symbol.hasInstance)
					return true;

				return Reflect.has(target, key);
			},

			deleteProperty(target, key) {
				if (key === Symbol.hasInstance)
					false;

				return Reflect.deleteProperty(target, key);
			},

			defineProperty(target, key, attributes) {
				if (key === Symbol.hasInstance)
					return false;

				return Reflect.defineProperty(target, key, attributes);
			},

			preventExtensions(target) {
				return Reflect.preventExtensions(target);
			},

			isExtensible(target) {
				return Reflect.isExtensible(target);
			},

			getPrototypeOf(target) {
				return staticMixinProtoMap.get(target);
			},

			setPrototypeOf(target, value) {
				return Reflect.isExtensible(target)
					? (staticMixinProtoMap.set(target, value), true)
					: false;
			},

			getOwnPropertyDescriptor(target, key) {
				if (key === Symbol.hasInstance)
					return {
						value: instanceOf,
						writable: false,
						enumerable: false,
						configurable: false,
					};
				if (key === "prototype")
					return {
						value: mixinPrototypeObject,
						writable: false,
						enumerable: false,
						configurable: false,
					};


				return Reflect.getOwnPropertyDescriptor(target, key);
			},

			// Rename function name to display mixin names in call stacks
			construct: Object.defineProperty((target, args, newTarget) => {
				const newObject: object = Reflect.construct(Base, args, newTarget),
					thisTargetStack = [newObject];

				for (const Class of classes)
					if (SymbolMixinConstruct in Class && typeof Class[SymbolMixinConstruct] === "function") {
						const result = Class[SymbolMixinConstruct]!.call(newObject, args);

						if (typeof result === "object" && result !== newObject)
							console.warn(`Mixin constructor of class "${ Class.name }" returned a different object than the one that was created via "new". This value will be overwritten by further mixin returns.`);
						if (typeof result === "object" && result != null)
							thisTargetStack.push(result);
					}


				// becomes the `this` of the constructed class
				return newObject;
			}, "name", { value: `new ${ name }` }),

			// Rename function name to display mixin names in call stacks
			apply: Object.defineProperty(() => {
				throw new TypeError(`Class constructor of mixin '${ name }' must be invoked with 'new'`);
			}, "name", { value: name }),
		}) as any as Class,

		baseProtoObject = Object.create(basePrototype),
		instanceOf = makeInstanceOf(mixinClass);

	mixinPrototypeMap.set(baseProtoObject, basePrototype);
	/** Mixin prototypes have a property called [Symbol.mixinPrototype] to indicate if they are mixin prototype proxies */
	const mixinPrototypeObject = new Proxy(baseProtoObject, {
		get(target, key) {
			if (key === SymbolMixinPrototype)
				return true;
			if (key === Symbol.toStringTag)
				return Base.name ?? basePrototype[Symbol.toStringTag];

			// Properties on the mixin prototype object itself come before mixin properties
			if (Reflect.has(target, key))
				return Reflect.get(target, key);

			// Mixin methods take precedence over base classes
			for (const Class of classes)
				if (Reflect.has(Class.prototype, key))
					return Reflect.get(Class.prototype, key);


			return undefined;
		},

		set(target, key, value) {
			if (key === Symbol.toStringTag || key === SymbolMixinPrototype)
				return false;

			return Reflect.set(target, key, value);
		},

		has(target, key) {
			if (key === Symbol.toStringTag || key === SymbolMixinPrototype)
				return true;

			// Mixin methods take precedence over base classes
			for (const Class of classes)
				if (Reflect.has(Class.prototype, key))
					return true;


			return Reflect.has(target, key);
		},

		defineProperty(target, key, attributes) {
			if (key === Symbol.hasInstance || key === SymbolMixinPrototype)
				return false;

			return Reflect.defineProperty(target, key, attributes);
		},

		deleteProperty(target, key) {
			if (key === Symbol.toStringTag || key === SymbolMixinPrototype)
				return false;

			return Reflect.deleteProperty(target, key);
		},

		getPrototypeOf(target) {
			return mixinPrototypeMap.get(target);
		},

		setPrototypeOf(target, value) {
			return mixinPrototypeMap.set(target, value), true;
		},

		isExtensible(target) {
			return Reflect.isExtensible(target);
		},

		preventExtensions(target) {
			return Reflect.preventExtensions(target);
		},

		getOwnPropertyDescriptor(target, property) {
			return Reflect.getOwnPropertyDescriptor(target, property);
		},
	});

	staticMixinMap.set(mixinClass, new WeakSet());

	return mixinClass as MixinClass<Base, Classes>;
}