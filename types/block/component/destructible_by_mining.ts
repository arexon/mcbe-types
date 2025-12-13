import { Serialize } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";
import type { ItemDescriptor } from "@mcbe/types/item";

@Serialize()
export class DestructibleByMiningBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => true })
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

@Serialize()
export class DestructibleByMining {
  @Serialize({ default: () => 0 })
  secondsToDestroy: number;

  @Serialize()
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

@Serialize()
export class ItemDestroySpeed {
  @Serialize()
  item: ItemDescriptor;

  @Serialize()
  destroySpeed: number;

  constructor(props: InputProps<ItemDestroySpeed, "item" | "destroySpeed">) {
    this.item = props.item;
    this.destroySpeed = props.destroySpeed;
  }
}
