"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  GenericMixin: () => GenericMixin,
  Mixin: () => Mixin,
  SymbolIsMixinClass: () => SymbolIsMixinClass,
  SymbolIsMixinPrototype: () => SymbolIsMixinPrototype,
  SymbolMixinClasses: () => SymbolMixinClasses,
  SymbolMixinConstruct: () => SymbolMixinConstruct,
  default: () => Mixin,
  hasMixinClass: () => hasMixinClass,
  isMixinClass: () => isMixinClass,
  isMixinPrototype: () => isMixinPrototype
});
module.exports = __toCommonJS(src_exports);

// src/symbols.ts
var SymbolMixinConstruct = Symbol("Symbol.mixinConstruct");
var SymbolMixinClasses = Symbol("Symbol.mixinClasses");
var SymbolIsMixinClass = Symbol("Symbol.isMixinClass");
var SymbolIsMixinPrototype = Symbol("Symbol.isMixinPrototype");
defineSymbol(SymbolMixinConstruct);
defineSymbol(SymbolIsMixinClass);
defineSymbol(SymbolIsMixinPrototype);
defineSymbol(SymbolMixinClasses);
function defineSymbol(symbol) {
  const property = symbol.description?.split(".")[1];
  return property ? (Object.defineProperty(Symbol, property, {
    value: symbol,
    configurable: false,
    enumerable: false,
    writable: false
  }), symbol) : symbol;
}

// src/weakMaps.ts
var mixinClassMap = /* @__PURE__ */ new WeakMap();
var mixinPrototypeMap = /* @__PURE__ */ new WeakMap();
var staticMixinProtoMap = /* @__PURE__ */ new WeakMap();

// src/utils/hasMixinClass.ts
function hasMixinClass(MixinClass, Class) {
  return mixinClassMap.get(MixinClass).has(Class);
}

// src/utils/isMixinClass.ts
function isMixinClass(Class) {
  return typeof Class === "object" && Class !== null && SymbolIsMixinClass in Class;
}

// src/utils/isMixinPrototype.ts
function isMixinPrototype(prototype) {
  return typeof prototype === "object" && SymbolIsMixinClass in prototype;
}

// src/utils/mixinInstanceOf.ts
function mixinInstanceOf(target, type) {
  if (mixinClassMap.has(type) && mixinClassMap.get(type).has(target))
    return true;
  return false;
}

// src/utils/makeInstanceOf.ts
function makeInstanceOf(type) {
  return (target) => mixinInstanceOf(target, type);
}

// src/mixin.ts
function isSpecialMixinKey(key) {
  return key === SymbolIsMixinClass || key === Symbol.hasInstance || key === "prototype";
}
function isSpecialMixinProtoKey(key) {
  return key === SymbolIsMixinPrototype || key === Symbol.toStringTag || key === SymbolMixinClasses;
}
function makeImmutableDescriptor(value) {
  return {
    value,
    writable: false,
    enumerable: false,
    configurable: false
  };
}
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
      if (key === SymbolIsMixinClass)
        return true;
      if (key === Symbol.hasInstance)
        return instanceOf;
      return key === "prototype" ? mixinPrototypeObject : Reflect.get(target, key);
    },
    set(target, key, value) {
      if (isSpecialMixinKey(key))
        return false;
      return Reflect.set(target, key, value);
    },
    has(target, key) {
      if (isSpecialMixinKey(key))
        return true;
      return Reflect.has(target, key);
    },
    deleteProperty(target, key) {
      if (isSpecialMixinKey(key))
        false;
      return Reflect.deleteProperty(target, key);
    },
    defineProperty(target, key, attributes) {
      if (isSpecialMixinKey(key))
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
      switch (key) {
        case "prototype":
          return makeImmutableDescriptor(mixinPrototypeObject);
        case Symbol.hasInstance:
          return makeImmutableDescriptor(instanceOf);
        case Symbol.isMixinClass:
          return makeImmutableDescriptor(true);
      }
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
      if (key === SymbolIsMixinPrototype)
        return true;
      if (key === Symbol.toStringTag)
        return Base.name ?? basePrototype[Symbol.toStringTag];
      if (Reflect.has(target, key))
        return Reflect.get(target, key);
      for (const Class of mixinClassMap.get(target))
        if (Reflect.has(Class.prototype, key))
          return Reflect.get(Class.prototype, key);
      return void 0;
    },
    set(target, key, value) {
      if (isSpecialMixinProtoKey(key))
        return false;
      return Reflect.set(target, key, value);
    },
    has(target, key) {
      if (isSpecialMixinProtoKey(key))
        return true;
      for (const Class of mixinClassMap.get(target))
        if (Reflect.has(Class.prototype, key))
          return true;
      return Reflect.has(target, key);
    },
    defineProperty(target, key, attributes) {
      if (isSpecialMixinProtoKey(key))
        return false;
      return Reflect.defineProperty(target, key, attributes);
    },
    deleteProperty(target, key) {
      if (isSpecialMixinProtoKey(key))
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
    getOwnPropertyDescriptor(target, key) {
      switch (key) {
        case Symbol.toStringTag:
          return makeImmutableDescriptor(Base.name ?? basePrototype[Symbol.toStringTag]);
      }
      return Reflect.getOwnPropertyDescriptor(target, key);
    }
  });
  mixinClassMap.set(baseMixin, new Set(classes));
  mixinClassMap.set(basePrototype, new Set(classes));
  return mixinClass;
}
//# sourceMappingURL=index.cjs.map
