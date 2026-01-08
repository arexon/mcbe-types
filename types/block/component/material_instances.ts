import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class MaterialInstancesBlockComponent implements ComponentNamespace {
  @Ser()
  value: Record<string, MaterialInstance>;

  get namespace(): string {
    return "minecraft:material_instances";
  }

  constructor(
    value: Record<
      string,
      MaterialInstance | DerivedInputProps<typeof MaterialInstance>
    >,
  ) {
    this.value = {};
    for (const key in value) {
      const instance = value[key];
      this.value[key] = instance instanceof MaterialInstance
        ? instance
        : new MaterialInstance(instance);
    }
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
    input: InputProps<
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
    this.texture = input.texture;
    this.renderMethod = input.renderMethod ?? "opaque";
    this.tintMethod = input.tintMethod;
    this.ambientOcclusion = input.ambientOcclusion ?? true;
    this.alphaMaskedTint = input.alphaMaskedTint ?? false;
    this.faceDimming = input.faceDimming ?? true;
    this.isotropic = input.isotropic ?? false;
  }
}

export type TintMethod =
  | "default_foliage"
  | "birch_foliage"
  | "evergreen_foliage"
  | "dry_foliage"
  | "grass"
  | "water";
