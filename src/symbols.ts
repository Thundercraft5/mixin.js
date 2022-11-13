export const SymbolMixinConstruct = Symbol("Symbol.mixinConstruct"),
	SymbolMixin = Symbol("Symbol.mixin"),
	SymbolMixinPrototype = Symbol("Symbol.mixinPrototype");

defineSymbol(SymbolMixinConstruct);
defineSymbol(SymbolMixin);
defineSymbol(SymbolMixinPrototype);

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