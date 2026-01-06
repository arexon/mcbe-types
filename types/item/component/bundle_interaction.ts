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
    props: InputProps<
      BundleInteractionItemComponent,
      never,
      "numViewableSlots"
    >,
  ) {
    this.numViewableSlots = props.numViewableSlots ?? 12;
  }
}
