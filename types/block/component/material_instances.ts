import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class MaterialInstancesBlockComponent implements ComponentNamespace {
  @Ser()
  value: Record<string, MaterialInstance>;

  get namespace(): string {
    return "minecraft:material_instances";
  }

  constructor(value: Record<string, MaterialInstance>) {
    this.value = value;
  }
}

@Ser()
export class MaterialInstance {
  @Ser()
  texture: string;

  @Ser({ default: () => "opaque" })
  renderMethod:
    | "opaque"
    | "double_sided"
    | "blend"
    | "alpha_test"
    | "blend_to_opaque"
    | "alpha_test_single_sided"
    | "alpha_test_to_opaque"
    | "alpha_test_single_sided_to_opaque";

  @Ser()
  tintMethod?: TintMethod;

  @Ser({ default: () => true })
  ambientOcclusion: number | boolean;

  @Ser({ default: () => false })
  alphaMaskedTint: boolean;

  @Ser({ default: () => true })
  faceDimming: boolean;

  @Ser({ default: () => false })
  isotropic: boolean;

  constructor(
    props: InputProps<
      MaterialInstance,
      "texture",
      | "alphaMaskedTint"
      | "renderMethod"
      | "tintMethod"
      | "ambientOcclusion"
      | "faceDimming"
      | "isotropic"
    >,
  ) {
    this.texture = props.texture;
    this.renderMethod = props.renderMethod ?? "opaque";
    this.tintMethod = props.tintMethod;
    this.ambientOcclusion = props.ambientOcclusion ?? true;
    this.alphaMaskedTint = props.alphaMaskedTint ?? false;
    this.faceDimming = props.faceDimming ?? true;
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
