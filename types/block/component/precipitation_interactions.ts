import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class PrecipitationInteractionsBlockComponent
  implements ComponentNamespace {
  @Edres({ default: () => "obstruct_rain_accumulate_snow" })
  precipitationBehavior:
    | "obstruct_rain"
    | "obstruct_rain_accumulate_snow"
    | "none";

  get namespace(): string {
    return "minecraft:precipitation_interactions";
  }

  constructor(
    props: InputProps<
      PrecipitationInteractionsBlockComponent,
      "precipitationBehavior"
    >,
  ) {
    this.precipitationBehavior = props.precipitationBehavior;
  }
}
