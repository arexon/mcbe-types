import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

@SerClass()
export class TransformationBlockComponent {
  @SerField({ default: () => [0, 0, 0] })
  rotation: [number, number, number];

  @SerField({ default: () => [0, 0, 0] })
  rotationPivot: [number, number, number];

  @SerField({ default: () => [1, 1, 1] })
  scale: [number, number, number];

  @SerField({ default: () => [0, 0, 0] })
  scalePivot: [number, number, number];

  @SerField({ default: () => [0, 0, 0] })
  translation: [number, number, number];

  readonly namespace = "minecraft:transformation";

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
