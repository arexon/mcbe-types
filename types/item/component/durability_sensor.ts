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
    props: InputProps<DurabilitySensorItemComponent, "durabilityThresholds">,
  ) {
    this.durabilityThresholds = props.durabilityThresholds;
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
    props: InputProps<
      DurabilityThreshold,
      "durability" | "particleType" | "soundEvent"
    >,
  ) {
    this.durability = props.durability;
    this.particleType = props.particleType;
    this.soundEvent = props.soundEvent;
  }
}
