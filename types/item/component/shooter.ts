import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

@Ser()
export class ShooterItemComponent implements ComponentNamespace {
  @Ser({ default: () => [] })
  ammunition: ItemAmmunition[];

  @Ser({ default: () => false })
  chargeOnDraw: boolean;

  @Ser({ default: () => 0 })
  maxDrawDuration: number;

  @Ser({ default: () => false })
  scalePowerByDrawDuration: boolean;

  get namespace(): string {
    return "minecraft:shooter";
  }

  constructor(
    props: InputProps<
      ShooterItemComponent,
      never,
      | "ammunition"
      | "chargeOnDraw"
      | "maxDrawDuration"
      | "scalePowerByDrawDuration"
    >,
  ) {
    this.ammunition = props.ammunition ?? [];
    this.chargeOnDraw = props.chargeOnDraw ?? false;
    this.maxDrawDuration = props.maxDrawDuration ?? 0;
    this.scalePowerByDrawDuration = props.scalePowerByDrawDuration ?? false;
  }
}

@Ser()
export class ItemAmmunition {
  @Ser()
  item: Identifier;

  @Ser({ default: () => false })
  useOffhand: boolean;

  @Ser({ default: () => false })
  useInCreative: boolean;

  @Ser({ default: () => false })
  searchInventory: boolean;

  constructor(
    props: InputProps<
      ItemAmmunition,
      "item",
      "useOffhand" | "useInCreative" | "searchInventory"
    >,
  ) {
    this.item = props.item;
    this.useOffhand = props.useOffhand ?? false;
    this.useInCreative = props.useInCreative ?? false;
    this.searchInventory = props.searchInventory ?? false;
  }
}
