import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class ThrowableItemComponent implements ComponentNamespace {
  @Ser({ default: () => false })
  doSwingAnimation: boolean;

  @Ser({ default: () => 1 })
  launchPowerScale: number;

  @Ser({ default: () => 0 })
  maxDrawDuration: number;

  @Ser({ default: () => 1 })
  maxLaunchPower: number;

  @Ser({ default: () => 0 })
  minDrawDuration: number;

  @Ser({ default: () => false })
  scalePowerByDrawDuration: boolean;

  get namespace(): string {
    return "minecraft:throwable";
  }

  constructor(
    props: InputProps<
      ThrowableItemComponent,
      never,
      | "doSwingAnimation"
      | "launchPowerScale"
      | "maxDrawDuration"
      | "maxLaunchPower"
      | "minDrawDuration"
      | "scalePowerByDrawDuration"
    >,
  ) {
    this.doSwingAnimation = props.doSwingAnimation ?? false;
    this.launchPowerScale = props.launchPowerScale ?? 1;
    this.maxDrawDuration = props.maxDrawDuration ?? 0;
    this.maxLaunchPower = props.maxLaunchPower ?? 1;
    this.minDrawDuration = props.minDrawDuration ?? 0;
    this.scalePowerByDrawDuration = props.scalePowerByDrawDuration ?? false;
  }
}
