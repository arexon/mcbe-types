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
    input: InputProps<
      SwingSoundsItemComponent,
      "attackCriticalHit" | "attackHit" | "attackMiss"
    >,
  ) {
    this.attackCriticalHit = input.attackCriticalHit;
    this.attackHit = input.attackHit;
    this.attackMiss = input.attackMiss;
  }
}
