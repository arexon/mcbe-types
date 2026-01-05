import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { FormatVersion } from "@mcbe/types/version";

@Ser()
export class BlockCulling {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: "minecraft:block_culling_rules/description" })
  identifier: Identifier;

  @Ser({ path: "minecraft:block_culling_rules" })
  rules: BlockCullingRule[];

  constructor(
    formatVersion: FormatVersion,
    props: InputProps<BlockCulling, "identifier" | "rules">,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = props.identifier;
    this.rules = props.rules;
  }
}

@Ser()
export class BlockCullingRule {
  @Ser({ default: () => true })
  cullAgainstFullAndOpaque: boolean;

  @Ser({ default: () => "default" })
  condition:
    | "default"
    | "same_block"
    | "same_block_permutation"
    | "same_culling_layer";

  @Ser()
  direction:
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west";

  @Ser()
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
