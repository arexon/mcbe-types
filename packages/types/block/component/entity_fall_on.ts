import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class EntityFallOnBlockComponent {
  @SerField({ default: () => 1 })
  minFallDistance: number;

  readonly namespace = "minecraft:entity_fall_on";

  constructor(
    props: InputProps<EntityFallOnBlockComponent, "minFallDistance">,
  ) {
    this.minFallDistance = props.minFallDistance;
  }
}
