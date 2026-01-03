import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class EntityFallOnBlockComponent implements ComponentNamespace {
  @Edres({ default: () => 1 })
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
