import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class RedstoneProducerBlockComponent {
  @SerField()
  power: number;

  @SerField()
  stronglyPoweredFace: "down" | "up" | "north" | "south" | "west" | "east";

  @SerField()
  connectedFaces?: ("down" | "up" | "north" | "south" | "west" | "east")[];

  @SerField({ default: () => false })
  transformRelative: boolean;

  readonly namespace = "minecraft:redstone_producer";

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
