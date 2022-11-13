// src/weakMaps.ts
var staticMixinMap = /* @__PURE__ */ new WeakMap();
var mixinPrototypeMap = /* @__PURE__ */ new WeakMap();
var staticMixinProtoMap = /* @__PURE__ */ new WeakMap();

// src/symbols.ts
var SymbolMixinConstruct = Symbol("Symbol.mixinConstruct");
var SymbolMixin = Symbol("Symbol.mixin");
var SymbolMixinPrototype = Symbol("Symbol.mixinPrototype");
defineSymbol(SymbolMixinConstruct);
defineSymbol(SymbolMixin);
defineSymbol(SymbolMixinPrototype);
function defineSymbol(symbol) {
  const property = symbol.description?.split(".")[1];
  return property ? (Object.defineProperty(Symbol, property, {
    value: symbol,
    configurable: false,
    enumerable: false,
    writable: false
  }), symbol) : symbol;
}

// src/utils/mixinInstanceOf.ts
function mixinInstanceOf(target, type) {
  if (staticMixinMap.has(type) && staticMixinMap.get(type).has(target))
    return true;
  return false;
}

// src/utils/makeInstanceOf.ts
function makeInstanceOf(type) {
  return (target) => mixinInstanceOf(target, type);
}

// src/mixin.ts
function GenericMixin(Base, ...classes) {
  return Mixin(Base, ...classes);
}
function Mixin(Base, ...classes) {
  const baseMixin = function() {
  }, basePrototype = Base.prototype, name = `${Base.name} (${classes.map((Class) => Class.name).join(", ")})`;
  baseMixin.prototype = basePrototype;
  Object.defineProperty(baseMixin, "name", { value: name, enumerable: false });
  staticMixinProtoMap.set(baseMixin, Base.prototype);
  const mixinClass = new Proxy(baseMixin, {
    get(target, key) {
      if (key === Symbol.hasInstance)
        return instanceOf;
      return key === "prototype" ? mixinPrototypeObject : Reflect.get(target, key);
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
      return Reflect.isExtensible(target) ? (staticMixinProtoMap.set(target, value), true) : false;
    },
    getOwnPropertyDescriptor(target, key) {
      if (key === Symbol.hasInstance)
        return {
          value: instanceOf,
          writable: false,
          enumerable: false,
          configurable: false
        };
      if (key === "prototype")
        return {
          value: mixinPrototypeObject,
          writable: false,
          enumerable: false,
          configurable: false
        };
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
    construct: Object.defineProperty((target, args, newTarget) => {
      const newObject = Reflect.construct(Base, args, newTarget), thisTargetStack = [newObject];
      for (const Class of classes)
        if (SymbolMixinConstruct in Class && typeof Class[SymbolMixinConstruct] === "function") {
          const result = Class[SymbolMixinConstruct].call(newObject, args);
          if (typeof result === "object" && result !== newObject)
            console.warn(`Mixin constructor of class "${Class.name}" returned a different object than the one that was created via "new". This value will be overwritten by further mixin returns.`);
          if (typeof result === "object" && result != null)
            thisTargetStack.push(result);
        }
      return newObject;
    }, "name", { value: `new ${name}` }),
    apply: Object.defineProperty(() => {
      throw new TypeError(`Class constructor of mixin '${name}' must be invoked with 'new'`);
    }, "name", { value: name })
  }), baseProtoObject = Object.create(basePrototype), instanceOf = makeInstanceOf(mixinClass);
  mixinPrototypeMap.set(baseProtoObject, basePrototype);
  const mixinPrototypeObject = new Proxy(baseProtoObject, {
    get(target, key) {
      if (key === SymbolMixinPrototype)
        return true;
      if (key === Symbol.toStringTag)
        return Base.name ?? basePrototype[Symbol.toStringTag];
      if (Reflect.has(target, key))
        return Reflect.get(target, key);
      for (const Class of classes)
        if (Reflect.has(Class.prototype, key))
          return Reflect.get(Class.prototype, key);
      return void 0;
    },
    set(target, key, value) {
      if (key === Symbol.toStringTag || key === SymbolMixinPrototype)
        return false;
      return Reflect.set(target, key, value);
    },
    has(target, key) {
      if (key === Symbol.toStringTag || key === SymbolMixinPrototype)
        return true;
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
    }
  });
  staticMixinMap.set(mixinClass, /* @__PURE__ */ new WeakSet());
  return mixinClass;
}
export {
  GenericMixin,
  Mixin,
  SymbolMixin,
  SymbolMixinConstruct,
  SymbolMixinPrototype,
  Mixin as default
};
