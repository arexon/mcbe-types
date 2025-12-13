import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";

@Ser()
export class ClientBlocks {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ custom: [(value) => value, "merge"] })
  blocks: Record<string, ClientBlock> = {};

  constructor(formatVersion: FormatVersion) {
    this.formatVersion = formatVersion;
  }

  add(identifier: string, block: ClientBlock): this {
    this.blocks[identifier] = block;
    return this;
  }
}

@Ser()
export class ClientBlock {
  @Ser()
  sound?: string;

  @Ser()
  ambientOcclusionExponent?: number;

  @Ser()
  brightnessGamma?: number;

  @Ser()
  isotropic?: ValueOrFaces<boolean>;

  @Ser()
  textures?: ValueOrFaces<string>;

  @Ser()
  carriedTextures?: ValueOrFaces<string>;

  constructor(
    props: InputProps<
      ClientBlock,
      | "sound"
      | "ambientOcclusionExponent"
      | "brightnessGamma"
      | "isotropic"
      | "textures"
      | "carriedTextures"
    >,
  ) {
    this.sound = props.sound;
    this.ambientOcclusionExponent = props.ambientOcclusionExponent;
    this.brightnessGamma = props.brightnessGamma;
    this.isotropic = props.isotropic;
    this.textures = props.textures;
    this.carriedTextures = props.carriedTextures;
  }
}

export type ValueOrFaces<T> = T | {
  up?: T;
  down?: T;
  side?: T;
  north?: T;
  south?: T;
  east?: T;
  west?: T;
};
