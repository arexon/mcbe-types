import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class FoodItemComponent implements ComponentNamespace {
  @Ser({ default: () => false })
  canAlwaysEat: boolean;

  @Ser()
  nutrition: number;

  @Ser()
  saturationModifier: number;

  @Ser()
  usingConvertsTo: string;

  get namespace(): string {
    return "minecraft:food";
  }

  constructor(
    props: InputProps<
      FoodItemComponent,
      "canAlwaysEat" | "nutrition" | "saturationModifier" | "usingConvertsTo"
    >,
  ) {
    this.canAlwaysEat = props.canAlwaysEat;
    this.nutrition = props.nutrition;
    this.saturationModifier = props.saturationModifier;
    this.usingConvertsTo = props.usingConvertsTo;
  }
}
