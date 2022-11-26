export declare const SymbolMixinConstruct: unique symbol, SymbolMixinClasses: unique symbol, SymbolIsMixinClass: unique symbol, SymbolIsMixinPrototype: unique symbol;
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
//# sourceMappingURL=symbols.d.ts.map