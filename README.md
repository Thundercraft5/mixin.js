---
Created: 2024-10-29T18:14
Edited: 2024-10-29T18:14
---
## 🎛️ `mixin.js`
`mixin.js` is a zero-dependancy lightweight library written in TypeScript that helps you implement mixins in JS/TS on any runtime.

## What does this do?
This library creates mixin classes via proxies, which are special classes which also index the mixin classes before deferring to the base class for resolution.
This library has full TS support *with generics* via declaration merging.

## Usage
**TODO**

## Roadmap
- [ ] Implement a `static [SymbolMixinApply](Class)`  to allow for static class access of the mixin
- [ ] Allow for static access of the mixin list via `Class.mixins` with a `ReadonlyIterableWeakMap` to allow for introspection and debugging (readonly for security)
- [ ] Decorators: Add decorator pattern support for mixins
- [ ] Check for memory leaks and use weak maps and sets where required
