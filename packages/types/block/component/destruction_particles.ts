import { SerClass, SerField } from "@mcbe/serialize";
import type { TintMethod } from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/common";

@SerClass()
export class DestructionParticlesBlockComponent {
  @SerField({ default: () => 100 })
  particleCount: number;

  @SerField()
  texture?: string;

  @SerField()
  tintMethod?: TintMethod;

  get namespace(): string {
    return "minecraft:destruction_particles";
  }

  constructor(
    props: InputProps<
      DestructionParticlesBlockComponent,
      "texture" | "tintMethod",
      "particleCount"
    >,
  ) {
    this.particleCount = props.particleCount ?? 100;
    this.texture = props.texture;
    this.tintMethod = props.tintMethod;
  }
}
