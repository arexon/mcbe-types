import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class EntityPlacerItemComponent implements ComponentNamespace {
  @Ser()
  entity: string;

  @Ser({ default: () => [] })
  useOn: string[];

  @Ser({ default: () => [] })
  dispenseOn: string[];

  get namespace(): string {
    return "minecraft:entity_placer";
  }

  constructor(
    input: InputProps<
      EntityPlacerItemComponent,
      "entity",
      "useOn" | "dispenseOn"
    >,
  ) {
    this.entity = input.entity;
    this.useOn = input.useOn ?? [];
    this.dispenseOn = input.dispenseOn ?? [];
  }
}
