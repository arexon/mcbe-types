# MCBE-Types

A (VERY WIP) TypeScript library for the Minecraft Bedrock Add-On format.

## Motivation

The goal of this library is to provide type implementations for _everything_ in
the Add-On format to enable high-level tools to build generators, templating
systems, and APIs on top of it without needing to maintain the types themselves.

Backward compatibility for older Add-On formats will **not** be supported due to
the sheer scale of the effort and time required. However, a minimum supported
format version will be picked (most likely 1.26.0) as the basis for future
backward compatibility. This means the library's API will not introduce breaking
changes to already existing code written in prior versions.

For now, the library will not offer much (hence "WIP" being plastered
everywhere). Small incremental additions will be made until we reach a
semi-usable state, at which point, the library will get published to
[JSR](https://jsr.io/).

## API

MCBE-Types provides classes that correspond to the format of each concept. Upper
level concepts (e.g. blocks, items) are flattened to avoid nesting and to make
constructing classes simpler. This means objects like `description` and
`minecraft:<block/item/entity/etc>` are omitted.

Because those classes do not match the format, they need special handling when
serializing them. To solve this, a decorator which implements a `toJSON()`
method is annotated on all classes, unlocking the ability to call
`JSON.stringify()` and get correct output that conforms to the format.
[`@mcbe/serialize`](https://github.com/arexon/mcbe-types/blob/main/serialize/mod.ts)
is the library responsible for handling this.

```ts
import {
  Block,
  BlockComponents,
  BlockPermutation,
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import { Range } from "@mcbe/types/common";
import { InventoryMenuCategory } from "@mcbe/types/inventory";
import { FormatVersion } from "@mcbe/types/version";
import { assertEquals } from "@std/assert";

const variants = ["oak", "spruce", "birch"];
const variantState = "custom:variant";

const block = new Block(new FormatVersion(1, 21, 130), {
  identifier: "custom:wood",
  menuCategory: new InventoryMenuCategory({ category: "nature" }),
  states: {
    [variantState]: new Range(0, variants.length - 1),
  },
  components: new BlockComponents(
    new GeometryBlockComponent("minecraft:geometry.full_block"),
  ),
  permutations: [
    ...variants.entries().map(([i, variant]) =>
      new BlockPermutation({
        condition: `q.block_state('${variantState}') == ${i}`,
        components: new BlockComponents(
          new MaterialInstancesBlockComponent({
            "*": { texture: `${variant}_planks` },
          }),
        ),
      })
    ),
  ],
});

assertEquals(
  JSON.stringify(block),
  JSON.stringify({
    "format_version": "1.21.130",
    "minecraft:block": {
      "description": {
        "identifier": "custom:wood",
        "menu_category": { "category": "nature" },
        "states": {
          "custom:variant": { "value": { "min": 0, "max": 2 } },
        },
      },
      "components": {
        "minecraft:geometry": "minecraft:geometry.full_block",
      },
      "permutations": [
        {
          "condition": "q.block_state('custom:variant') == 0",
          "components": {
            "minecraft:material_instances": {
              "*": { "texture": "oak_planks" },
            },
          },
        },
        {
          "condition": "q.block_state('custom:variant') == 1",
          "components": {
            "minecraft:material_instances": {
              "*": { "texture": "spruce_planks" },
            },
          },
        },
        {
          "condition": "q.block_state('custom:variant') == 2",
          "components": {
            "minecraft:material_instances": {
              "*": { "texture": "birch_planks" },
            },
          },
        },
      ],
    },
  }),
);
```
