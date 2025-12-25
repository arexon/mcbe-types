import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class RedstoneProducerBlockComponent implements ComponentNamespace {
  @Serialize()
  power: number;

  @Serialize()
  stronglyPoweredFace: "down" | "up" | "north" | "south" | "west" | "east";

  @Serialize()
  connectedFaces?: ("down" | "up" | "north" | "south" | "west" | "east")[];

  @Serialize({ default: () => false })
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
