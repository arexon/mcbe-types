import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class EntityFallOnBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => 1 })
  minFallDistance: number;

  get namespace(): string {
    return "minecraft:entity_fall_on";
  }

  constructor(
    props: InputProps<EntityFallOnBlockComponent, "minFallDistance">,
  ) {
    this.minFallDistance = props.minFallDistance;
  }
}
