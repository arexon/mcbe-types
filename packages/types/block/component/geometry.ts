import { SerClass, SerField } from "@mcbe/serialize";
import type { Identifier } from "@mcbe/types/identifier";
import type { Molang } from "@mcbe/types/molang";
import type { InputProps } from "@mcbe/types/shared";

@SerClass({ transparent: "identifier" })
export class GeometryBlockComponent {
  @SerField()
  identifier: Identifier;

  @SerField()
  boneVisibility?: Record<string, Molang>;

  @SerField()
  culling?: Identifier;

  @SerField()
  cullingLayer?: Identifier;

  @SerField({ default: (value) => value === false })
  uvLock: boolean | string[];

  static namespace: string = "minecraft:geometry";

  constructor(
    props: InputProps<
      GeometryBlockComponent,
      "identifier" | "boneVisibility" | "culling" | "cullingLayer",
      "uvLock"
    >,
  ) {
    this.identifier = props.identifier;
    this.boneVisibility = props.boneVisibility;
    this.culling = props.culling;
    this.cullingLayer = props.cullingLayer;
    this.uvLock = props.uvLock ?? false;
  }
}
