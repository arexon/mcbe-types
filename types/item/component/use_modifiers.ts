import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class UseModifiersItemComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  emitVibrations: boolean;

  @Ser()
  movementModifier?: number;

  @Ser()
  startSound?: string;

  @Ser({ default: () => 0 })
  useDuration: number;

  get namespace(): string {
    return "minecraft:use_modifiers";
  }

  constructor(
    input: InputProps<
      UseModifiersItemComponent,
      "movementModifier" | "startSound" | "useDuration",
      "emitVibrations"
    >,
  ) {
    this.emitVibrations = input.emitVibrations ?? true;
    this.movementModifier = input.movementModifier;
    this.startSound = input.startSound;
    this.useDuration = input.useDuration;
  }
}
