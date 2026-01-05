import { Ser } from "@mcbe/serialize";
import { type BlockComponent, BlockTraits } from "@mcbe/types/block";
import { Components, type InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { InventoryMenuCategory } from "@mcbe/types/inventory";
import type { Molang } from "@mcbe/types/molang";
import type { FormatVersion } from "@mcbe/types/version";
import { unreachable } from "@std/assert";

export * from "./client.ts";
export * from "./component/mod.ts";
export * from "./culling.ts";
export * from "./descriptor.ts";
export * from "./trait.ts";

export class BlockComponents extends Components<BlockComponent> {}

export type BlockInputProps = InputProps<
  Block,
  "identifier" | "menuCategory",
  "states" | "traits" | "components" | "permutations"
>;

@Ser()
export class Block {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ default: () => false })
  useBetaFeatures: boolean = false;

  @Ser({ path: "minecraft:block/description" })
  identifier: Identifier;

  @Ser({ path: "minecraft:block/description" })
  menuCategory: InventoryMenuCategory;

  @Ser({
    path: "minecraft:block/description",
    default: () => ({}),
  })
  states: Record<
    Identifier,
    | (number | boolean | string)[]
    | { value: { min: number; max: number } }
  >;

  @Ser({
    path: "minecraft:block/description",
    default: () => new BlockTraits(),
  })
  traits: BlockTraits;

  @Ser({
    path: "minecraft:block",
    default: () => new BlockComponents(),
  })
  components: BlockComponents;

  @Ser({
    path: "minecraft:block",
    default: () => [],
  })
  permutations: BlockPermutation[];

  constructor(formatVersion: FormatVersion, props: BlockInputProps);
  constructor(
    formatVersion: FormatVersion,
    useBetaFeatures: boolean,
    props: BlockInputProps,
  );
  constructor(
    param0: FormatVersion,
    param1: boolean | BlockInputProps,
    param2?: BlockInputProps,
  ) {
    this.formatVersion = param0;

    this.useBetaFeatures = typeof param1 === "boolean" ? param1 : false;

    const props = typeof param1 === "object" ? param1 : param2;
    if (props !== undefined) {
      this.identifier = props.identifier;
      this.menuCategory = props.menuCategory;
      this.states = props.states ?? {};
      this.traits = props.traits ?? new BlockTraits();
      if (Array.isArray(props.components)) {
        this.components = new BlockComponents(...props.components);
      } else {
        this.components = props.components ?? new BlockComponents();
      }
      this.permutations = props.permutations ?? [];
    } else {
      unreachable();
    }
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
