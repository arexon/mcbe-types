import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";

@SerClass()
export class ClientBlocks {
  @SerField()
  formatVersion: FormatVersion;

  @SerField({ custom: [(value) => value, "merge"] })
  blocks: Record<string, ClientBlock> = {};

  constructor(formatVersion: FormatVersion) {
    this.formatVersion = formatVersion;
  }

  add(identifier: string, block: ClientBlock): this {
    this.blocks[identifier] = block;
    return this;
  }
}

@SerClass()
export class ClientBlock {
  @SerField()
  sound?: string;

  @SerField()
  ambientOcclusionExponent?: number;

  @SerField()
  brightnessGamma?: number;

  @SerField()
  isotropic?: ValueOrFaces<boolean>;

  @SerField()
  textures?: ValueOrFaces<string>;

  @SerField()
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
