import { SerClass, SerField } from "@mcbe/serialize";
import type {
  BlockComponents,
  BlockState,
  BlockTraits,
} from "@mcbe/types/block";
import type { Identifier } from "@mcbe/types/identifier";
import type { InventoryMenuCategory } from "@mcbe/types/inventory";
import type { Molang } from "@mcbe/types/molang";
import { FormatVersion, type InputProps } from "@mcbe/types/shared";

export * from "./component/mod.ts";
export * from "./descriptor.ts";
export * from "./trait.ts";

@SerClass()
export class BlockDefinition {
  @SerField()
  formatVersion: FormatVersion;

  @SerField({ rename: "minecraft:block" })
  block: ServerBlock;

  constructor(
    formatVersion: FormatVersion,
    props: ConstructorParameters<typeof ServerBlock>[0],
  );
  constructor(
    props: InputProps<
      BlockDefinition,
      "formatVersion" | "block"
    >,
  );
  constructor(
    formatVersionOrProps:
      | FormatVersion
      | InputProps<BlockDefinition, "formatVersion" | "block">,
    props?: ConstructorParameters<typeof ServerBlock>[0],
  ) {
    if (!(formatVersionOrProps instanceof FormatVersion)) {
      this.formatVersion = formatVersionOrProps.formatVersion;
      this.block = formatVersionOrProps.block;
    } else if (props !== undefined) {
      this.formatVersion = formatVersionOrProps;
      this.block = new ServerBlock(props);
    } else {
      throw new Error("unreachable");
    }
  }
}

@SerClass()
export class ServerBlock {
  @SerField()
  description: BlockDescription;

  @SerField()
  components: BlockComponents;

  @SerField()
  permutations?: BlockPermutation[];

  constructor(
    props: InputProps<
      ServerBlock,
      "description" | "components" | "permutations"
    >,
  ) {
    this.description = props.description;
    this.components = props.components;
    this.permutations = props.permutations;
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
