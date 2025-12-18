import { SerClass, SerField } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";
import type { ItemDescriptor } from "@mcbe/types/item";

@SerClass()
export class DestructibleByMiningBlockComponent implements ComponentNamespace {
  @SerField({ default: () => true })
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

@SerClass()
export class DestructibleByMining {
  @SerField({ default: () => 0 })
  secondsToDestroy: number;

  @SerField()
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

@SerClass()
export class ItemDestroySpeed {
  @SerField()
  item: ItemDescriptor;

  @SerField()
  destroy_speed: number;

  constructor(props: InputProps<ItemDestroySpeed, "item" | "destroy_speed">) {
    this.item = props.item;
    this.destroy_speed = props.destroy_speed;
  }
}
