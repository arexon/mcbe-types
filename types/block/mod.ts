import { Ser } from "@mcbe/serialize";
import type { BlockComponent, BlockTrait } from "@mcbe/types/block";
import {
  type InputProps,
  type InventoryCategory,
  Range,
} from "@mcbe/types/common";
import type { Molang } from "@mcbe/types/molang";
import type { FormatVersion } from "@mcbe/types/version";
import { unreachable } from "@std/assert";
import { associateBy, mapEntries } from "@std/collections";

export * from "./client.ts";
export * from "./component/mod.ts";
export * from "./culling.ts";
export * from "./descriptor.ts";
export * from "./trait.ts";

export type BlockInputProps = InputProps<
  Block,
  "identifier" | "group",
  | "category"
  | "isHiddenInCommand"
  | "states"
  | "traits"
  | "components"
  | "permutations"
>;

@Ser()
export class Block {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ default: () => false })
  useBetaFeatures: boolean = false;

  @Ser({ path: "minecraft:block/description" })
  identifier: string;

  @Ser({
    default: () => "none",
    path: "minecraft:block/description/menu_category",
  })
  category: InventoryCategory;

  @Ser({ path: "minecraft:block/description/menu_category" })
  group?: string;

  @Ser({
    path: "minecraft:block/description/menu_category",
    default: () => false,
  })
  isHiddenInCommand: boolean;

  @Ser({
    path: "minecraft:block/description",
    default: () => ({}),
    custom: [(states) =>
      mapEntries(states, ([key, state]) => {
        if (state instanceof Range) {
          // The output conforms to the format.
          // deno-lint-ignore no-explicit-any
          return [key, Range.customValuesObject(state) as any];
        }
        return [key, state];
      }), "normal"],
  })
  states: Record<string, (number | boolean | string)[] | Range>;

  @Ser({
    path: "minecraft:block/description",
    default: () => [],
    custom: [
      (traits) => {
        if (typeof traits === "undefined") return traits;
        return associateBy(traits, (trait) => trait.namespace);
      },
      "normal",
    ],
  })
  traits: BlockTrait[];

  @Ser({
    path: "minecraft:block",
    default: () => [],
    custom: [(comps) => associateBy(comps, (comp) => comp.namespace), "normal"],
  })
  components: BlockComponent[];

  @Ser({
    path: "minecraft:block",
    default: () => [],
  })
  permutations: BlockPermutation[];

  constructor(formatVersion: FormatVersion, input: BlockInputProps);
  constructor(
    formatVersion: FormatVersion,
    useBetaFeatures: boolean,
    input: BlockInputProps,
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
      this.category = props.category ?? "none";
      this.group = props.group;
      this.isHiddenInCommand = props.isHiddenInCommand ?? false;
      this.states = props.states ?? {};
      this.traits = props.traits ?? [];
      this.components = props.components ?? [];
      this.permutations = (props.permutations ?? []).map((v) =>
        v instanceof BlockPermutation ? v : new BlockPermutation(v)
      );
    } else {
      unreachable();
    }
  }
}

@Ser()
export class BlockPermutation {
  @Ser()
  condition: Molang;

  @Ser({
    custom: [(comps) => associateBy(comps, (comp) => comp.namespace), "normal"],
  })
  components: BlockComponent[];

  constructor(input: InputProps<BlockPermutation, "condition" | "components">) {
    this.condition = input.condition;
    this.components = input.components;
  }
}
