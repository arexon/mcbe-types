import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class EntityFallOnBlockComponent implements ComponentNamespace {
  @Ser({ default: () => 1 })
  minFallDistance: number;

  get namespace(): string {
    return "minecraft:entity_fall_on";
  }

  constructor(
    input: InputProps<EntityFallOnBlockComponent, "minFallDistance">,
  ) {
    this.minFallDistance = input.minFallDistance;
  }
}
