import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class PrecipitationInteractionsBlockComponent
  implements ComponentNamespace {
  @Serialize({ default: () => "obstruct_rain_accumulate_snow" })
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
