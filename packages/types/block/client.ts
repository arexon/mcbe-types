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
  textures?: string;

  @SerField()
  sound?: string;

  constructor(
    props: InputProps<ClientBlock, "textures" | "sound">,
  ) {
    this.textures = props.textures;
    this.sound = props.sound;
  }
}
