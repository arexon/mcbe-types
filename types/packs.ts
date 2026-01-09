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

  blocks: DefinitionSet<Block> = new DefinitionSet(Block);
  items: DefinitionSet<Item> = new DefinitionSet(Item);
  manifest: Manifest;

  constructor(rootPath: string, manifest: Manifest) {
    this.rootPath = rootPath;
    this.manifest = manifest;
  }

  add(...defs: BehaviorPackDefinition[]): void {
    for (const def of defs) {
      if (def instanceof Block) {
        this.blocks.add(def);
      } else if (def instanceof Item) {
        this.items.add(def);
      }
    }
  }

  async save(): Promise<void> {
    const tasks: Promise<void>[] = [];

    tasks.push(
      writeJsonFile(join(this.rootPath, "manifest.json"), this.manifest),
    );

    tasks.push(
      ...this.blocks.values().map((def) => {
        const path = this.#createPath(
          "blocks",
          def.identifier,
          ".block.json",
        );
        return writeJsonFile(path, def);
      }),
    );

    tasks.push(
      ...this.items.values().map((def) => {
        const path = this.#createPath(
          "items",
          def.identifier,
          ".item.json",
        );
        return writeJsonFile(path, def);
      }),
    );

    await Promise.all(tasks);
  }

  #createPath(
    directory: string,
    identifier: string,
    suffix: string,
  ): string {
    return join(this.rootPath, directory, identifier.split(":")[1] + suffix);
  }
}

export class DefinitionSet<T extends BehaviorPackDefinition> extends Set<T> {
  #seen = new Set<string>();
  // deno-lint-ignore no-explicit-any
  #ctor: new (...args: any[]) => T;

  // deno-lint-ignore no-explicit-any
  constructor(ctor: new (...args: any[]) => T) {
    super();
    this.#ctor = ctor;
  }

  override add(...defs: T[]): this {
    for (const def of defs) {
      const id = this.getId(def);
      if (this.#seen.has(id)) {
        throw new TypeError(`Duplicate definition for ID: ${id}`);
      }
      this.#seen.add(id);
      super.add(def);
    }
    return this;
  }

  override delete(def: T): boolean {
    const id = this.getId(def);
    this.#seen.delete(id);
    return super.delete(def);
  }

  override clear(): void {
    this.#seen.clear();
    super.clear();
  }

  getId(def: T): string {
    if (def instanceof this.#ctor) {
      return def.identifier;
    }
    throw new TypeError(
      `Unknown definition: got ${def.constructor.name}, expected ${this.#ctor.name}`,
    );
  }
}

async function writeJsonFile(path: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await ensureDir(dirname(path));
  await Deno.writeTextFile(path, json);
}
