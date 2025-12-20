import { SerClass, SerField } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@SerClass()
export class DestructibleByExplosionBlockComponent
  implements ComponentNamespace {
  @SerField({ default: () => true })
  value: boolean | DestructibleByExplosion;

  get namespace(): string {
    return "minecraft:destructible_by_explosion";
  }

  constructor(value: boolean);
  constructor(props: DerivedInputProps<typeof DestructibleByExplosion>);
  constructor(
    value: boolean | DerivedInputProps<typeof DestructibleByExplosion>,
  ) {
    if (typeof value === "boolean") this.value = value;
    else this.value = new DestructibleByExplosion(value);
  }
}

@SerClass()
export class DestructibleByExplosion {
  @SerField({ default: () => 0 })
  explosionResistance: number;

  constructor(
    props: InputProps<DestructibleByExplosion, never, "explosionResistance">,
  ) {
    this.explosionResistance = props.explosionResistance ?? 0;
  }
}
