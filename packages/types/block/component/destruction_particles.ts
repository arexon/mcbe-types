import { Serialize } from "@mcbe/serialize";
import type { TintMethod } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class DestructionParticlesBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => 100 })
  particleCount: number;

  @Serialize()
  texture?: string;

  @Serialize()
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
