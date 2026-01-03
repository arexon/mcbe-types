import { Edres } from "@mcbe/edres";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Edres()
export class DestructibleByExplosionBlockComponent
  implements ComponentNamespace {
  @Edres({ default: () => true })
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

@Edres()
export class DestructibleByExplosion {
  @Edres({ default: () => 0 })
  explosionResistance: number;

  constructor(
    props: InputProps<DestructibleByExplosion, never, "explosionResistance">,
  ) {
    this.explosionResistance = props.explosionResistance ?? 0;
  }
}
