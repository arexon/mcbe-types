import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { Molang } from "@mcbe/types/molang";

const DEFAULT_CULLING_LAYER = "minecraft:culling_layer.undefined";

@Ser({ transparent: "identifier" })
export class GeometryBlockComponent implements ComponentNamespace {
  @Ser()
  identifier: Identifier;

  @Ser()
  boneVisibility?: Record<string, Molang>;

  @Ser()
  culling?: Identifier;

  @Ser({ default: () => DEFAULT_CULLING_LAYER })
  cullingLayer: Identifier;

  @Ser({ default: () => false })
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
