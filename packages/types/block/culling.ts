import { Serialize } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { FormatVersion } from "@mcbe/types/version";

@Serialize()
export class BlockCulling {
  @Serialize()
  formatVersion: FormatVersion;

  @Serialize()
  description: BlockCullingDescription;

  @Serialize()
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

@Serialize()
export class BlockCullingDescription {
  @Serialize()
  identifier: Identifier;

  constructor(props: InputProps<BlockCullingDescription, "identifier">) {
    this.identifier = props.identifier;
  }
}

@Serialize()
export class BlockCullingRule {
  @Serialize({ default: () => true })
  cullAgainstFullAndOpaque: boolean;

  @Serialize({ default: () => "default" })
  condition:
    | "default"
    | "same_block"
    | "same_block_permutation"
    | "same_culling_layer";

  @Serialize()
  direction:
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west";

  @Serialize()
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
