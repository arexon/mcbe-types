import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class DestructibleByExplosionBlockComponent
  implements ComponentNamespace {
  @Ser({ default: () => true })
  value: boolean | DestructibleByExplosion;

  get namespace(): string {
    return "minecraft:destructible_by_explosion";
  }

  constructor(
    input: boolean | DerivedInputProps<typeof DestructibleByExplosion>,
  ) {
    if (typeof input === "boolean") {
      this.value = input;
    } else {
      this.value = input instanceof DestructibleByExplosion
        ? input
        : new DestructibleByExplosion(input);
    }
  }
}

@Ser()
export class DestructibleByExplosion {
  @Ser({ default: () => 0 })
  explosionResistance: number;

  constructor(
    input: InputProps<DestructibleByExplosion, never, "explosionResistance">,
  ) {
    this.explosionResistance = input.explosionResistance ?? 0;
  }
}
