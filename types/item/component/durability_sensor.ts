import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class DurabilitySensorItemComponent implements ComponentNamespace {
  @Ser()
  durabilityThresholds: DurabilityThreshold[];

  get namespace(): string {
    return "minecraft:durability_sensor";
  }

  constructor(
    input: InputProps<DurabilitySensorItemComponent, "durabilityThresholds">,
  ) {
    this.durabilityThresholds = input.durabilityThresholds;
  }
}

@Ser()
export class DurabilityThreshold {
  @Ser()
  durability: number;

  @Ser()
  particleType: string;

  @Ser()
  soundEvent: string;

  constructor(
    input: InputProps<
      DurabilityThreshold,
      "durability" | "particleType" | "soundEvent"
    >,
  ) {
    this.durability = input.durability;
    this.particleType = input.particleType;
    this.soundEvent = input.soundEvent;
  }
}
