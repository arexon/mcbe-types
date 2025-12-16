import { SerClass, SerField } from "@mcbe/serialize";
import type { DerivedInputProps, InputProps } from "@mcbe/types/common";

@SerClass()
export class DestructibleByExplosionBlockComponent {
  @SerField({ default: () => true })
  value: boolean | DestructibleByExplosion;

  readonly namespace = "minecraft:destructible_by_explosion";

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
  @SerField()
  explosionResistance: number;

  constructor(
    props: InputProps<DestructibleByExplosion, "explosionResistance">,
  ) {
    this.explosionResistance = props.explosionResistance;
  }
}
