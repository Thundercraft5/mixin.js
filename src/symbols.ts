import type { GenericMixin, Mixin } from "./mixin";

export const SymbolMixinConstruct = Symbol("Symbol.mixinConstruct"),
	SymbolMixinClasses = Symbol("Symbol.mixinClasses"),
	SymbolIsMixinClass = Symbol("Symbol.isMixinClass"),
	SymbolIsMixinPrototype = Symbol("Symbol.isMixinPrototype");

defineSymbol(SymbolMixinConstruct);
defineSymbol(SymbolIsMixinClass);
defineSymbol(SymbolIsMixinPrototype);
defineSymbol(SymbolMixinClasses);

function defineSymbol(symbol: symbol) {
	const property = symbol.description?.split(".")[1];

	return property
		? (Object.defineProperty(Symbol, property, {
			value: symbol,
			configurable: false,
			enumerable: false,
			writable: false,
		}), symbol)
		: symbol;
}

declare global {
	interface SymbolConstructor {
		/**
		 * A method that defines a constructor function that is called when this class is instantiated as a mixin. Called by {@linkcode Mixin} and {@linkcode GenericMixin} statically.
		 */
		readonly mixinConstruct: typeof SymbolMixinConstruct;

		/**
		 * A property that contains a list of mixins that were added to the base class.
		 */
		readonly mixinClasses: typeof SymbolMixinClasses;

		/**
		 * Denotes if the object is a special mixin class.
		 */
		readonly isMixinClass: typeof SymbolIsMixinClass;

		/**
		 * Denotes if the object is a special mixin prototype of a mixin class.
		 */
		readonly isMixinPrototype: typeof SymbolIsMixinPrototype;
	}
}