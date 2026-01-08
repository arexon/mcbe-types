import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";
import type { ItemDescriptor } from "@mcbe/types/item";

@Ser({ transparent: "value" })
export class DestructibleByMiningBlockComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  value: boolean | DestructibleByMining;

  get namespace(): string {
    return "minecraft:destructible_by_mining";
  }

  constructor(input: boolean | DerivedInputProps<typeof DestructibleByMining>) {
    if (typeof input === "boolean") {
      this.value = input;
    } else {
      this.value = input instanceof DestructibleByMining
        ? input
        : new DestructibleByMining(input);
    }
  }
}

@Ser()
export class DestructibleByMining {
  @Ser({ default: () => 0 })
  secondsToDestroy: number;

  @Ser({ default: () => [] })
  itemSpecificSpeeds: ItemDestroySpeed[];

  constructor(
    input: InputProps<
      DestructibleByMining,
      "secondsToDestroy",
      "itemSpecificSpeeds"
    >,
  ) {
    this.secondsToDestroy = input.secondsToDestroy;
    this.itemSpecificSpeeds = input.itemSpecificSpeeds ?? [];
  }
}

@Ser()
export class ItemDestroySpeed {
  @Ser()
  item: ItemDescriptor;

  @Ser()
  destroySpeed: number;

  constructor(input: InputProps<ItemDestroySpeed, "item" | "destroySpeed">) {
    this.item = input.item;
    this.destroySpeed = input.destroySpeed;
  }
}
