import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class BundleInteractionItemComponent implements ComponentNamespace {
  @Ser({ default: () => 12 })
  numViewableSlots: number;

  get namespace(): string {
    return "minecraft:num_viewable_slots";
  }

  constructor(
    input: InputProps<
      BundleInteractionItemComponent,
      never,
      "numViewableSlots"
    >,
  ) {
    this.numViewableSlots = input.numViewableSlots ?? 12;
  }
}
