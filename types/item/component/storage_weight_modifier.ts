import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class StorageWeightModifierItemComponent implements ComponentNamespace {
  @Ser({ default: () => 4 })
  weightInStorageItem: number;

  get namespace(): string {
    return "minecraft:storage_weight_modifier";
  }

  constructor(
    props: InputProps<
      StorageWeightModifierItemComponent,
      never,
      "weightInStorageItem"
    >,
  ) {
    this.weightInStorageItem = props.weightInStorageItem ?? 4;
  }
}
