import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { Molang } from "@mcbe/types/molang";

const DEFAULT_CULLING_LAYER = "minecraft:culling_layer.undefined";

@Ser({ transparent: "identifier" })
export class GeometryBlockComponent implements ComponentNamespace {
  @Ser()
  identifier: string;

  @Ser()
  boneVisibility?: Record<string, Molang>;

  @Ser()
  culling?: string;

  @Ser({ default: () => DEFAULT_CULLING_LAYER })
  cullingLayer: string;

  @Ser({ default: () => false })
  uvLock: boolean | string[];

  get namespace(): string {
    return "minecraft:geometry";
  }

  constructor(
    input:
      | InputProps<
        GeometryBlockComponent,
        "identifier" | "boneVisibility" | "culling",
        "uvLock" | "cullingLayer"
      >
      | string,
  ) {
    if (typeof input === "string") {
      this.identifier = input;
      this.cullingLayer = DEFAULT_CULLING_LAYER;
      this.uvLock = false;
    } else {
      this.identifier = input.identifier;
      this.boneVisibility = input.boneVisibility;
      this.culling = input.culling;
      this.cullingLayer = input.cullingLayer ?? DEFAULT_CULLING_LAYER;
      this.uvLock = input.uvLock ?? false;
    }
  }
}
