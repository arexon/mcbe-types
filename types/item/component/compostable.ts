import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class CompostableItemComponent implements ComponentNamespace {
  @Ser()
  compostingChance: number;

  get namespace(): string {
    return "minecraft:compostable";
  }

  constructor(props: InputProps<CompostableItemComponent, "compostingChance">) {
    this.compostingChance = props.compostingChance;
  }
}
