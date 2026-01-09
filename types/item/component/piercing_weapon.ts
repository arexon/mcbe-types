import { Ser } from "@mcbe/serialize";
import {
  type ComponentNamespace,
  type InputProps,
  Range,
} from "@mcbe/types/common";

const DEFAULT_REACH = new Range(0, 3);

@Ser()
export class PiercingWeaponItemComponent implements ComponentNamespace {
  @Ser({ default: () => 0 })
  hitboxMargin: number;

  @Ser({
    default: () => DEFAULT_REACH,
    custom: [Range.customObject, "normal"],
  })
  reach: Range;

  @Ser({
    default: () => DEFAULT_REACH,
    custom: [Range.customObject, "normal"],
  })
  creativeReach: Range;

  get namespace(): string {
    return "minecraft:piercing_weapon";
  }

  constructor(
    input: InputProps<
      PiercingWeaponItemComponent,
      never,
      "hitboxMargin" | "reach" | "creativeReach"
    >,
  ) {
    this.reach = input.reach ?? DEFAULT_REACH;
    this.creativeReach = input.creativeReach ?? DEFAULT_REACH;
    this.hitboxMargin = input.hitboxMargin ?? 0;
  }
}
