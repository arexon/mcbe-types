import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class StorageWeightLimitItemComponent implements ComponentNamespace {
  @Ser({ default: () => 64 })
  maxWeightLimit: number;

  get namespace(): string {
    return "minecraft:storage_weight_limit";
  }

  constructor(
    input: InputProps<StorageWeightLimitItemComponent, never, "maxWeightLimit">,
  ) {
    this.maxWeightLimit = input.maxWeightLimit ?? 64;
  }
}
