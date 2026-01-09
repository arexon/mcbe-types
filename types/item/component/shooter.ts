import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

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
    input: InputProps<
      ShooterItemComponent,
      never,
      | "ammunition"
      | "chargeOnDraw"
      | "maxDrawDuration"
      | "scalePowerByDrawDuration"
    >,
  ) {
    this.ammunition = input.ammunition ?? [];
    this.chargeOnDraw = input.chargeOnDraw ?? false;
    this.maxDrawDuration = input.maxDrawDuration ?? 0;
    this.scalePowerByDrawDuration = input.scalePowerByDrawDuration ?? false;
  }
}

@Ser()
export class ItemAmmunition {
  @Ser()
  item: string;

  @Ser({ default: () => false })
  useOffhand: boolean;

  @Ser({ default: () => false })
  useInCreative: boolean;

  @Ser({ default: () => false })
  searchInventory: boolean;

  constructor(
    input: InputProps<
      ItemAmmunition,
      "item",
      "useOffhand" | "useInCreative" | "searchInventory"
    >,
  ) {
    this.item = input.item;
    this.useOffhand = input.useOffhand ?? false;
    this.useInCreative = input.useInCreative ?? false;
    this.searchInventory = input.searchInventory ?? false;
  }
}
