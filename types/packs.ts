// deno-lint-ignore-file style-guide/class-serialization

import { Block } from "@mcbe/types/block";
import { Item } from "@mcbe/types/item";
import type { Manifest } from "@mcbe/types/manifest";
import { ensureDir } from "@std/fs";
import { dirname, join } from "@std/path";

export type BehaviorPackDefinition =
  | Block
  | Item;

export class BehaviorPack {
  rootPath: string;

  blocks: Map<string, Block> = new Map();
  items: Map<string, Item> = new Map();
  manifest: Manifest;

  constructor(rootPath: string, manifest: Manifest) {
    this.rootPath = rootPath;
    this.manifest = manifest;
  }

  set(...defs: BehaviorPackDefinition[]): void {
    for (const def of defs) {
      if (def instanceof Block) {
        this.blocks.set(idToPath(def.identifier), def);
      } else if (def instanceof Item) {
        this.items.set(idToPath(def.identifier), def);
      }
    }
  }

  async save(): Promise<void> {
    {
      const path = join(this.rootPath, "manifest.json");
      await writeJsonFile(path, this.manifest);
    }

    for (const [path, block] of this.blocks) {
      const fullPath = join(this.rootPath, "blocks", path + ".block.json");
      await writeJsonFile(fullPath, block);
    }

    for (const [path, item] of this.items) {
      const fullPath = join(this.rootPath, "items", path + ".item.json");
      await writeJsonFile(fullPath, item);
    }
  }
}

async function writeJsonFile(path: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await ensureDir(dirname(path));
  await Deno.writeTextFile(path, json);
}

function idToPath(identifier: string): string {
  return identifier.split(":")[1];
}
