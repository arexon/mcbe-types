import { Ser } from "@mcbe/serialize";
import type { TintMethod } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class DestructionParticlesBlockComponent implements ComponentNamespace {
  @Ser({ default: () => 100 })
  particleCount: number;

  @Ser()
  texture?: string;

  @Ser()
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
