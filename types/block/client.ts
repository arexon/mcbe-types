import { Edres } from "@mcbe/edres";
import type { InputProps } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";

@Edres()
export class ClientBlocks {
  @Edres()
  formatVersion: FormatVersion;

  @Edres({ custom: [(value) => value, "merge"] })
  blocks: Record<string, ClientBlock> = {};

  constructor(formatVersion: FormatVersion) {
    this.formatVersion = formatVersion;
  }

  add(identifier: string, block: ClientBlock): this {
    this.blocks[identifier] = block;
    return this;
  }
}

@Edres()
export class ClientBlock {
  @Edres()
  sound?: string;

  @Edres()
  ambientOcclusionExponent?: number;

  @Edres()
  brightnessGamma?: number;

  @Edres()
  isotropic?: ValueOrFaces<boolean>;

  @Edres()
  textures?: ValueOrFaces<string>;

  @Edres()
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
