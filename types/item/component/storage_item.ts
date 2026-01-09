import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { ItemDescriptor } from "@mcbe/types/item";

@Ser()
export class StorageItemComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  allowNestedStorageItems: boolean;

  @Ser({ default: () => [] })
  allowedItems: ItemDescriptor[];

  @Ser({ default: () => [] })
  bannedItems: ItemDescriptor[];

  @Ser({ default: () => 64 })
  maxSlots: number;

  @Ser()
  maxWeightSlot?: number;

  @Ser()
  weightInStorageItem?: number;

  get namespace(): string {
    return "minecraft:storage_item";
  }

  constructor(
    input: InputProps<
      StorageItemComponent,
      | "maxWeightSlot"
      | "weightInStorageItem",
      | "allowNestedStorageItems"
      | "allowedItems"
      | "bannedItems"
      | "maxSlots"
    >,
  ) {
    this.allowNestedStorageItems = input.allowNestedStorageItems ?? true;
    this.allowedItems = input.allowedItems ?? [];
    this.bannedItems = input.bannedItems ?? [];
    this.maxSlots = input.maxSlots ?? 64;
    this.maxWeightSlot = input.maxWeightSlot;
    this.weightInStorageItem = input.weightInStorageItem;
  }
}
