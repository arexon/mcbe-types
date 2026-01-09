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
    input: InputProps<
      ClientBlock,
      | "sound"
      | "ambientOcclusionExponent"
      | "brightnessGamma"
      | "isotropic"
      | "textures"
      | "carriedTextures"
    >,
  ) {
    this.sound = input.sound;
    this.ambientOcclusionExponent = input.ambientOcclusionExponent;
    this.brightnessGamma = input.brightnessGamma;
    this.isotropic = input.isotropic;
    this.textures = input.textures;
    this.carriedTextures = input.carriedTextures;
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
