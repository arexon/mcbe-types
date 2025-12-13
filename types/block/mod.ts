import { Ser } from "@mcbe/serialize";
import {
  BlockComponents,
  type BlockState,
  type BlockTraits,
} from "@mcbe/types/block";
import type { DerivedInputProps, InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { InventoryMenuCategory } from "@mcbe/types/inventory";
import type { Molang } from "@mcbe/types/molang";
import { FormatVersion } from "@mcbe/types/version";

export * from "./client.ts";
export * from "./component/mod.ts";
export * from "./culling.ts";
export * from "./descriptor.ts";
export * from "./trait.ts";

@Ser()
export class BlockDefinition {
  @Ser()
  formatVersion: FormatVersion;

  // NOTE: For now, we will not expose this in the constructor.
  @Ser({ default: () => false })
  useBetaFeatures: boolean = false;

  @Ser({ rename: "minecraft:block" })
  block: Block;

  constructor(
    formatVersion: FormatVersion,
    props: DerivedInputProps<typeof Block>,
  );
  constructor(
    props: InputProps<BlockDefinition, "formatVersion" | "block">,
  );
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

@Ser()
export class Block {
  @Ser()
  description: BlockDescription;

  @Ser({ default: () => new BlockComponents() })
  components: BlockComponents;

  @Ser({ default: () => [] })
  permutations: BlockPermutation[];

  constructor(
    props: InputProps<
      Block,
      "description",
      "components" | "permutations"
    >,
  ) {
    this.description = props.description;
    this.components = props.components ?? new BlockComponents();
    this.permutations = props.permutations ?? [];
  }
}

@Ser()
export class BlockDescription {
  @Ser()
  identifier: Identifier;

  @Ser()
  menuCategory?: InventoryMenuCategory;

  @Ser()
  states?: Record<Identifier, BlockState>;

  @Ser()
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

@Ser()
export class BlockPermutation {
  @Ser()
  condition: Molang;

  @Ser()
  components: BlockComponents;

  constructor(props: InputProps<BlockPermutation, "condition" | "components">) {
    this.condition = props.condition;
    this.components = props.components;
  }
}
