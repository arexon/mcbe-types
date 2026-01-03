import { Edres } from "@mcbe/edres";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";
import type { ItemDescriptor } from "@mcbe/types/item";

@Edres()
export class DestructibleByMiningBlockComponent implements ComponentNamespace {
  @Edres({ default: () => true })
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

@Edres()
export class DestructibleByMining {
  @Edres({ default: () => 0 })
  secondsToDestroy: number;

  @Edres()
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

@Edres()
export class ItemDestroySpeed {
  @Edres()
  item: ItemDescriptor;

  @Edres()
  destroySpeed: number;

  constructor(props: InputProps<ItemDestroySpeed, "item" | "destroySpeed">) {
    this.item = props.item;
    this.destroySpeed = props.destroySpeed;
  }
}
