import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";
import type { ItemDescriptor } from "@mcbe/types/item";

@Ser()
export class DestructibleByMiningBlockComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  value: boolean | DestructibleByMining;

  get namespace(): string {
    return "minecraft:destructible_by_mining";
  }

  constructor(value: boolean);
  constructor(props: DerivedInputProps<typeof DestructibleByMining>);
  constructor(value: boolean | DerivedInputProps<typeof DestructibleByMining>) {
    if (typeof value === "boolean") this.value = value;
    else this.value = new DestructibleByMining(value);
  }
}

@Ser()
export class DestructibleByMining {
  @Ser({ default: () => 0 })
  secondsToDestroy: number;

  @Ser()
  itemSpecificSpeeds: ItemDestroySpeed[];

  constructor(
    props: InputProps<
      DestructibleByMining,
      "secondsToDestroy" | "itemSpecificSpeeds"
    >,
  ) {
    this.secondsToDestroy = props.secondsToDestroy;
    this.itemSpecificSpeeds = props.itemSpecificSpeeds;
  }
}

@Ser()
export class ItemDestroySpeed {
  @Ser()
  item: ItemDescriptor;

  @Ser()
  destroySpeed: number;

  constructor(props: InputProps<ItemDestroySpeed, "item" | "destroySpeed">) {
    this.item = props.item;
    this.destroySpeed = props.destroySpeed;
  }
}
