export const
	/** Stores weak references between the mixin class/mixin class prototype and thier mixins.  */
	mixinClassMap = new WeakMap<object, Set<object>>(),
	mixinPrototypeMap = new WeakMap(),
	staticMixinProtoMap = new WeakMap(),
	mixinProtoClassesMap = new WeakMap();