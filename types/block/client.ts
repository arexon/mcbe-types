import { Serialize } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";

@Serialize()
export class ClientBlocks {
  @Serialize()
  formatVersion: FormatVersion;

  @Serialize({ custom: [(value) => value, "merge"] })
  blocks: Record<string, ClientBlock> = {};

  constructor(formatVersion: FormatVersion) {
    this.formatVersion = formatVersion;
  }

  add(identifier: string, block: ClientBlock): this {
    this.blocks[identifier] = block;
    return this;
  }
}

@Serialize()
export class ClientBlock {
  @Serialize()
  sound?: string;

  @Serialize()
  ambientOcclusionExponent?: number;

  @Serialize()
  brightnessGamma?: number;

  @Serialize()
  isotropic?: ValueOrFaces<boolean>;

  @Serialize()
  textures?: ValueOrFaces<string>;

  @Serialize()
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
