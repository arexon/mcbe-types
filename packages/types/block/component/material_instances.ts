import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

@SerClass({ transparent: "value" })
export class MaterialInstancesBlockComponent {
  @SerField()
  value: Record<string, MaterialInstance>;

  get namespace(): string {
    return "minecraft:material_instances";
  }

  constructor(value: Record<string, MaterialInstance>) {
    this.value = value;
  }
}

@SerClass()
export class MaterialInstance {
  @SerField()
  texture: string;

  @SerField({ default: () => "opaque" })
  renderMethod:
    | "opaque"
    | "double_sided"
    | "blend"
    | "alpha_test"
    | "alpha_test_single_sided";

  @SerField()
  tintMethod?: TintMethod;

  @SerField({ default: () => false })
  ambientOcclusion: number | boolean;

  @SerField({ default: () => false })
  alphaMaskedTint: boolean;

  @SerField()
  faceDimming?: boolean;

  @SerField({ default: () => false })
  isotropic: boolean;

  constructor(
    props: InputProps<
      MaterialInstance,
      "texture",
      | "renderMethod"
      | "tintMethod"
      | "ambientOcclusion"
      | "alphaMaskedTint"
      | "faceDimming"
      | "isotropic"
    >,
  ) {
    this.texture = props.texture;
    this.renderMethod = props.renderMethod ?? "opaque";
    this.tintMethod = props.tintMethod;
    this.ambientOcclusion = props.ambientOcclusion ?? false;
    this.alphaMaskedTint = props.alphaMaskedTint ?? false;
    this.faceDimming = props.faceDimming;
    this.isotropic = props.isotropic ?? false;
  }
}

export type TintMethod =
  | "default_foliage"
  | "birch_foliage"
  | "evergreen_foliage"
  | "dry_foliage"
  | "grass"
  | "water";
