import { Edres } from "@mcbe/edres";
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

@Edres()
export class BlockDefinition {
  @Edres()
  formatVersion: FormatVersion;

  // NOTE: For now, we will not expose this in the constructor.
  @Edres({ default: () => false })
  useBetaFeatures: boolean = false;

  @Edres({ rename: "minecraft:block" })
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

@Edres()
export class Block {
  @Edres()
  description: BlockDescription;

  @Edres({ default: () => new BlockComponents() })
  components: BlockComponents;

  @Edres({ default: () => [] })
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

@Edres()
export class BlockDescription {
  @Edres()
  identifier: Identifier;

  @Edres()
  menuCategory?: InventoryMenuCategory;

  @Edres()
  states?: Record<Identifier, BlockState>;

  @Edres()
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

@Edres()
export class BlockPermutation {
  @Edres()
  condition: Molang;

  @Edres()
  components: BlockComponents;

  constructor(props: InputProps<BlockPermutation, "condition" | "components">) {
    this.condition = props.condition;
    this.components = props.components;
  }
}
