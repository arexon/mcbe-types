import { SerClass, SerField } from "@mcbe/serialize";
import type {
  BlockComponents,
  BlockState,
  BlockTraits,
} from "@mcbe/types/block";
import type { Identifier } from "@mcbe/types/identifier";
import type { InventoryMenuCategory } from "@mcbe/types/inventory";
import type { Molang } from "@mcbe/types/molang";
import {
  Components,
  type DerivedInputProps,
  FormatVersion,
  type InputProps,
} from "@mcbe/types/shared";

export * from "./component/mod.ts";
export * from "./culling.ts";
export * from "./descriptor.ts";
export * from "./trait.ts";

@SerClass()
export class BlockDefinition {
  @SerField()
  formatVersion: FormatVersion;

  @SerField({ rename: "minecraft:block" })
  block: Block;

  constructor(
    formatVersion: FormatVersion,
    props: DerivedInputProps<typeof Block>,
  );
  constructor(props: InputProps<BlockDefinition, "formatVersion" | "block">);
  constructor(
    formatVersionOrProps:
      | FormatVersion
      | InputProps<BlockDefinition, "formatVersion" | "block">,
    props?: DerivedInputProps<typeof Block>,
  ) {
    if (!(formatVersionOrProps instanceof FormatVersion)) {
      this.formatVersion = formatVersionOrProps.formatVersion;
      this.block = formatVersionOrProps.block;
    } else if (props !== undefined) {
      this.formatVersion = formatVersionOrProps;
      this.block = new Block(props);
    } else {
      throw new Error("unreachable");
    }
  }
}

@SerClass()
export class Block {
  @SerField()
  description: BlockDescription;

  @SerField({ default: () => new Components() })
  components: BlockComponents;

  @SerField({ default: () => [] })
  permutations: BlockPermutation[];

  constructor(
    props: InputProps<
      Block,
      "description",
      "components" | "permutations"
    >,
  ) {
    this.description = props.description;
    this.components = props.components ?? new Components();
    this.permutations = props.permutations ?? [];
  }
}

@SerClass()
export class BlockDescription {
  @SerField()
  identifier: Identifier;

  @SerField()
  menuCategory?: InventoryMenuCategory;

  @SerField()
  states?: Record<Identifier, BlockState>;

  @SerField()
  traits?: BlockTraits;

  constructor(
    props: InputProps<
      BlockDescription,
      "identifier" | "menuCategory" | "states" | "traits"
    >,
  ) {
    this.identifier = props.identifier;
    this.menuCategory = props.menuCategory;
    this.states = props.states;
    this.traits = props.traits;
  }
}

@SerClass()
export class BlockPermutation {
  @SerField()
  condition: Molang;

  @SerField()
  components: BlockComponents;

  constructor(props: InputProps<BlockPermutation, "condition" | "components">) {
    this.condition = props.condition;
    this.components = props.components;
  }
}
