import { Edres } from "@mcbe/edres";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { FormatVersion } from "@mcbe/types/version";

@Edres()
export class BlockCulling {
  @Edres()
  formatVersion: FormatVersion;

  @Edres()
  description: BlockCullingDescription;

  @Edres()
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

@Edres()
export class BlockCullingDescription {
  @Edres()
  identifier: Identifier;

  constructor(props: InputProps<BlockCullingDescription, "identifier">) {
    this.identifier = props.identifier;
  }
}

@Edres()
export class BlockCullingRule {
  @Edres({ default: () => true })
  cullAgainstFullAndOpaque: boolean;

  @Edres({ default: () => "default" })
  condition:
    | "default"
    | "same_block"
    | "same_block_permutation"
    | "same_culling_layer";

  @Edres()
  direction:
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west";

  @Edres()
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
