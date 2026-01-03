import { Edres } from "@mcbe/edres";
import type { TintMethod } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class DestructionParticlesBlockComponent implements ComponentNamespace {
  @Edres({ default: () => 100 })
  particleCount: number;

  @Edres()
  texture?: string;

  @Edres()
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
