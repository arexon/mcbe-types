import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { Molang } from "@mcbe/types/molang";

const DEFAULT_CULLING_LAYER = "minecraft:culling_layer.undefined";

@Edres({ transparent: "identifier" })
export class GeometryBlockComponent implements ComponentNamespace {
  @Edres()
  identifier: Identifier;

  @Edres()
  boneVisibility?: Record<string, Molang>;

  @Edres()
  culling?: Identifier;

  @Edres({ default: () => DEFAULT_CULLING_LAYER })
  cullingLayer: Identifier;

  @Edres({ default: () => false })
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
