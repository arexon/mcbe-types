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
    input: InputProps<
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
    this.doSwingAnimation = input.doSwingAnimation ?? false;
    this.launchPowerScale = input.launchPowerScale ?? 1;
    this.maxDrawDuration = input.maxDrawDuration ?? 0;
    this.maxLaunchPower = input.maxLaunchPower ?? 1;
    this.minDrawDuration = input.minDrawDuration ?? 0;
    this.scalePowerByDrawDuration = input.scalePowerByDrawDuration ?? false;
  }
}
