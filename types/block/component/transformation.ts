import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class TransformationBlockComponent implements ComponentNamespace {
  @Ser({ default: () => [0, 0, 0] })
  rotation: [number, number, number];

  @Ser({ default: () => [0, 0, 0] })
  rotationPivot: [number, number, number];

  @Ser({ default: () => [1, 1, 1] })
  scale: [number, number, number];

  @Ser({ default: () => [0, 0, 0] })
  scalePivot: [number, number, number];

  @Ser({ default: () => [0, 0, 0] })
  translation: [number, number, number];

  get namespace(): string {
    return "minecraft:transformation";
  }

  constructor(
    props: InputProps<
      TransformationBlockComponent,
      never,
      "rotation" | "rotationPivot" | "scale" | "scalePivot" | "translation"
    >,
  ) {
    this.rotation = props.rotation ?? [0, 0, 0];
    this.rotationPivot = props.rotationPivot ?? [0, 0, 0];
    this.scale = props.scale ?? [1, 1, 1];
    this.scalePivot = props.scalePivot ?? [0, 0, 0];
    this.translation = props.translation ?? [0, 0, 0];
  }
}
