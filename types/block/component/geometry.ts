import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { Molang } from "@mcbe/types/molang";

const DEFAULT_CULLING_LAYER = "minecraft:culling_layer.undefined";

@Serialize({ transparent: "identifier" })
export class GeometryBlockComponent implements ComponentNamespace {
  @Serialize()
  identifier: Identifier;

  @Serialize()
  boneVisibility?: Record<string, Molang>;

  @Serialize()
  culling?: Identifier;

  @Serialize({ default: () => DEFAULT_CULLING_LAYER })
  cullingLayer: Identifier;

  @Serialize({ default: () => false })
  uvLock: boolean | string[];

  get namespace(): string {
    return "minecraft:geometry";
  }

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
