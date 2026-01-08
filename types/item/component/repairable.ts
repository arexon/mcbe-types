import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { Molang } from "@mcbe/types/molang";

@Ser()
export class RepairableItemComponent implements ComponentNamespace {
  @Ser({ default: () => [] })
  repairItems: RepairableItemEntry[];

  get namespace(): string {
    return "minecraft:repairable";
  }

  constructor(
    input: InputProps<RepairableItemComponent, never, "repairItems">,
  ) {
    this.repairItems = input.repairItems ?? [];
  }
}

@Ser()
export class RepairableItemEntry {
  @Ser()
  items: Identifier[];

  @Ser()
  repairAmount: number | Molang;

  constructor(
    input: InputProps<RepairableItemEntry, "items" | "repairAmount">,
  ) {
    this.items = input.items;
    this.repairAmount = input.repairAmount;
  }
}
