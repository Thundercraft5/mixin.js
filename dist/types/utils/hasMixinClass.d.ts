import type { Class } from "@thundercraft5/type-utils";
import type { HasMixinClass, MixinClassObject } from "../types";
export default function hasMixinClass<M extends MixinClassObject, C extends Class>(MixinClass: M, Class: C): MixinClass is HasMixinClass<M, C>;
//# sourceMappingURL=hasMixinClass.d.ts.map