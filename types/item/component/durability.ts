import { Ser } from "@mcbe/serialize";
import {
  type ComponentNamespace,
  type InputProps,
  Range,
} from "@mcbe/types/common";

@Ser()
export class DurabilityItemComponent implements ComponentNamespace {
  @Ser()
  maxDurability: number;

  @Ser({ custom: [Range.customObject, "normal"] })
  damageChance: Range;

  get namespace(): string {
    return "minecraft:durability";
  }

  constructor(
    props: InputProps<
      DurabilityItemComponent,
      "maxDurability" | "damageChance"
    >,
  ) {
    this.maxDurability = props.maxDurability;
    this.damageChance = props.damageChance;
  }
}
