import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class RedstoneProducerBlockComponent implements ComponentNamespace {
  @Ser()
  power: number;

  @Ser()
  stronglyPoweredFace: "down" | "up" | "north" | "south" | "west" | "east";

  @Ser()
  connectedFaces?: ("down" | "up" | "north" | "south" | "west" | "east")[];

  @Ser({ default: () => false })
  transformRelative: boolean;

  get namespace(): string {
    return "minecraft:redstone_producer";
  }

  constructor(
    input: InputProps<
      RedstoneProducerBlockComponent,
      "power" | "stronglyPoweredFace" | "connectedFaces",
      "transformRelative"
    >,
  ) {
    this.power = input.power;
    this.stronglyPoweredFace = input.stronglyPoweredFace;
    this.connectedFaces = input.connectedFaces;
    this.transformRelative = input.transformRelative ?? false;
  }
}
