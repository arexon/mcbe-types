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
    props: InputProps<
      EntityPlacerItemComponent,
      "entity",
      "useOn" | "dispenseOn"
    >,
  ) {
    this.entity = props.entity;
    this.useOn = props.useOn ?? [];
    this.dispenseOn = props.dispenseOn ?? [];
  }
}
