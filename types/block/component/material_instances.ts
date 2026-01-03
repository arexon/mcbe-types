import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres({ transparent: "value" })
export class MaterialInstancesBlockComponent implements ComponentNamespace {
  @Edres()
  value: Record<string, MaterialInstance>;

  get namespace(): string {
    return "minecraft:material_instances";
  }

  constructor(value: Record<string, MaterialInstance>) {
    this.value = value;
  }
}

@Edres()
export class MaterialInstance {
  @Edres()
  texture: string;

  @Edres({ default: () => "opaque" })
  renderMethod:
    | "opaque"
    | "double_sided"
    | "blend"
    | "alpha_test"
    | "blend_to_opaque"
    | "alpha_test_single_sided"
    | "alpha_test_to_opaque"
    | "alpha_test_single_sided_to_opaque";

  @Edres()
  tintMethod?: TintMethod;

  @Edres({ default: () => true })
  ambientOcclusion: number | boolean;

  @Edres()
  alphaMaskedTint?: boolean;

  @Edres({ default: () => true })
  faceDimming: boolean;

  @Edres({ default: () => false })
  isotropic: boolean;

  constructor(
    props: InputProps<
      MaterialInstance,
      "texture" | "alphaMaskedTint",
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
