import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

export type WearableItemSlot =
  | "slot.armor"
  | "slot.armor.body"
  | "slot.armor.chest"
  | "slot.armor.feet"
  | "slot.armor.head"
  | "slot.armor.legs"
  | "slot.weapon.offhand";

@Ser()
export class WearableItemComponent implements ComponentNamespace {
  @Ser({ default: () => false })
  hidesPlayerLocation: boolean;

  @Ser({ default: () => 0 })
  protection: number;

  @Ser()
  slot: WearableItemSlot;

  @Ser({ default: () => false })
  dispensable: boolean;

  get namespace(): string {
    return "minecraft:wearable";
  }

  constructor(
    props: InputProps<
      WearableItemComponent,
      "slot",
      "hidesPlayerLocation" | "protection" | "dispensable"
    >,
  ) {
    this.hidesPlayerLocation = props.hidesPlayerLocation ?? false;
    this.protection = props.protection ?? 0;
    this.slot = props.slot;
    this.dispensable = props.dispensable ?? false;
  }
}
