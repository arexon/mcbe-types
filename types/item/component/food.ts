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
    input: InputProps<
      FoodItemComponent,
      "canAlwaysEat" | "nutrition" | "saturationModifier" | "usingConvertsTo"
    >,
  ) {
    this.canAlwaysEat = input.canAlwaysEat;
    this.nutrition = input.nutrition;
    this.saturationModifier = input.saturationModifier;
    this.usingConvertsTo = input.usingConvertsTo;
  }
}
