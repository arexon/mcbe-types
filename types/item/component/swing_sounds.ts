import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class SwingSoundsItemComponent implements ComponentNamespace {
  @Ser()
  attackCriticalHit?: string;

  @Ser()
  attackHit?: string;

  @Ser()
  attackMiss?: string;

  get namespace(): string {
    return "minecraft:swing_sounds";
  }

  constructor(
    props: InputProps<
      SwingSoundsItemComponent,
      "attackCriticalHit" | "attackHit" | "attackMiss"
    >,
  ) {
    this.attackCriticalHit = props.attackCriticalHit;
    this.attackHit = props.attackHit;
    this.attackMiss = props.attackMiss;
  }
}
