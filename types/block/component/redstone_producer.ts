import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class RedstoneProducerBlockComponent implements ComponentNamespace {
  @Edres()
  power: number;

  @Edres()
  stronglyPoweredFace: "down" | "up" | "north" | "south" | "west" | "east";

  @Edres()
  connectedFaces?: ("down" | "up" | "north" | "south" | "west" | "east")[];

  @Edres({ default: () => false })
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
