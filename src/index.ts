export * from "./mixin";
export { Mixin as default } from "./mixin";
export * from "./symbols";
export * from "./types";

declare global {
	interface SymbolConstructor {
		readonly mixinConstruct: unique symbol;
		readonly mixinPrototype: unique symbol;
		readonly mixin: unique symbol;
	}
}