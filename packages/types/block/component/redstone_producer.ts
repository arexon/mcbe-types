import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class RedstoneProducerBlockComponent implements ComponentNamespace {
  @SerField()
  power: number;

  @SerField()
  stronglyPoweredFace: "down" | "up" | "north" | "south" | "west" | "east";

  @SerField()
  connectedFaces?: ("down" | "up" | "north" | "south" | "west" | "east")[];

  @SerField({ default: () => false })
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
