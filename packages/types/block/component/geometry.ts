import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { Molang } from "@mcbe/types/molang";

const DEFAULT_CULLING_LAYER = "minecraft:culling_layer.undefined";

@SerClass({ transparent: "identifier" })
export class GeometryBlockComponent {
  @SerField()
  identifier: Identifier;

  @SerField()
  boneVisibility?: Record<string, Molang>;

  @SerField()
  culling?: Identifier;

  @SerField({ default: () => DEFAULT_CULLING_LAYER })
  cullingLayer: Identifier;

  @SerField({ default: () => false })
  uvLock: boolean | string[];

  readonly namespace = "minecraft:geometry";

  constructor(
    props: InputProps<
      GeometryBlockComponent,
      "identifier" | "boneVisibility" | "culling",
      "uvLock" | "cullingLayer"
    >,
  ) {
    this.identifier = props.identifier;
    this.boneVisibility = props.boneVisibility;
    this.culling = props.culling;
    this.cullingLayer = props.cullingLayer ?? DEFAULT_CULLING_LAYER;
    this.uvLock = props.uvLock ?? false;
  }
}
