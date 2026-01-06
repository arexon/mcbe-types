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
    props: InputProps<
      UseModifiersItemComponent,
      "movementModifier" | "startSound" | "useDuration",
      "emitVibrations"
    >,
  ) {
    this.emitVibrations = props.emitVibrations ?? true;
    this.movementModifier = props.movementModifier;
    this.startSound = props.startSound;
    this.useDuration = props.useDuration;
  }
}
