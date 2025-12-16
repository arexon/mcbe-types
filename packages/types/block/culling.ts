import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { FormatVersion } from "@mcbe/types/version";

@SerClass()
export class BlockCulling {
  @SerField()
  formatVersion: FormatVersion;

  @SerField()
  description: BlockCullingDescription;

  @SerField()
  rules: BlockCullingRule[];

  constructor(
    formatVersion: FormatVersion,
    props: InputProps<BlockCulling, "description" | "rules">,
  ) {
    this.formatVersion = formatVersion;
    this.description = props.description;
    this.rules = props.rules;
  }
}

@SerClass()
export class BlockCullingDescription {
  @SerField()
  identifier: Identifier;

  constructor(props: InputProps<BlockCullingDescription, "identifier">) {
    this.identifier = props.identifier;
  }
}

@SerClass()
export class BlockCullingRule {
  @SerField({ default: () => true })
  cullAgainstFullAndOpaque: boolean;

  @SerField({ default: () => "default" })
  condition:
    | "default"
    | "same_block"
    | "same_block_permutation"
    | "same_culling_layer";

  @SerField()
  direction:
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west";

  @SerField()
  geometryPart: "bone" | "cube" | "face";

  constructor(
    props: InputProps<
      BlockCullingRule,
      "direction" | "geometryPart",
      "cullAgainstFullAndOpaque" | "condition"
    >,
  ) {
    this.cullAgainstFullAndOpaque = props.cullAgainstFullAndOpaque ?? true;
    this.condition = props.condition ?? "default";
    this.direction = props.direction;
    this.geometryPart = props.geometryPart;
  }
}
