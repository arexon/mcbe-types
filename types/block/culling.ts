import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";

@Ser()
export class BlockCulling {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: "minecraft:block_culling_rules/description" })
  identifier: string;

  @Ser({ path: "minecraft:block_culling_rules" })
  rules: BlockCullingRule[];

  constructor(
    formatVersion: FormatVersion,
    input: InputProps<BlockCulling, "identifier" | "rules">,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = input.identifier;
    this.rules = input.rules;
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
    input: InputProps<
      BlockCullingRule,
      "direction" | "geometryPart",
      "cullAgainstFullAndOpaque" | "condition"
    >,
  ) {
    this.cullAgainstFullAndOpaque = input.cullAgainstFullAndOpaque ?? true;
    this.condition = input.condition ?? "default";
    this.direction = input.direction;
    this.geometryPart = input.geometryPart;
  }
}
