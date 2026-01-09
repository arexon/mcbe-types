import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps, Vec3 } from "@mcbe/types/common";

@Ser()
export class TransformationBlockComponent implements ComponentNamespace {
  @Ser({ default: () => [0, 0, 0] })
  rotation: Vec3;

  @Ser({ default: () => [0, 0, 0] })
  rotationPivot: Vec3;

  @Ser({ default: () => [1, 1, 1] })
  scale: Vec3;

  @Ser({ default: () => [0, 0, 0] })
  scalePivot: Vec3;

  @Ser({ default: () => [0, 0, 0] })
  translation: Vec3;

  get namespace(): string {
    return "minecraft:transformation";
  }

  constructor(
    input: InputProps<
      TransformationBlockComponent,
      never,
      "rotation" | "rotationPivot" | "scale" | "scalePivot" | "translation"
    >,
  ) {
    this.rotation = input.rotation ?? [0, 0, 0];
    this.rotationPivot = input.rotationPivot ?? [0, 0, 0];
    this.scale = input.scale ?? [1, 1, 1];
    this.scalePivot = input.scalePivot ?? [0, 0, 0];
    this.translation = input.translation ?? [0, 0, 0];
  }
}
