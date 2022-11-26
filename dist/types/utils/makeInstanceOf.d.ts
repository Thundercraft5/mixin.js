import type { Class } from "@thundercraft5/type-utils";
export default function makeInstanceOf<T extends Class>(type: T): (target: any) => target is InstanceType<T>;
//# sourceMappingURL=makeInstanceOf.d.ts.map