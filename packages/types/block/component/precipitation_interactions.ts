import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class PrecipitationInteractionsBlockComponent {
  @SerField({ default: () => "obstruct_rain_accumulate_snow" })
  precipitationBehavior:
    | "obstruct_rain"
    | "obstruct_rain_accumulate_snow"
    | "none";

  readonly namespace = "minecraft:precipitation_interactions";

  constructor(
    props: InputProps<
      PrecipitationInteractionsBlockComponent,
      "precipitationBehavior"
    >,
  ) {
    this.precipitationBehavior = props.precipitationBehavior;
  }
}
