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
    props: InputProps<
      RedstoneProducerBlockComponent,
      "power" | "stronglyPoweredFace" | "connectedFaces",
      "transformRelative"
    >,
  ) {
    this.power = props.power;
    this.stronglyPoweredFace = props.stronglyPoweredFace;
    this.connectedFaces = props.connectedFaces;
    this.transformRelative = props.transformRelative ?? false;
  }
}
