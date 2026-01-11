// deno-lint-ignore-file style-guide/class-serialization

import { Block } from "@mcbe/types/block";
import {
  AggregateFeature,
  type Feature,
  FeatureRule,
  SingleBlockFeature,
} from "@mcbe/types/feature";
import { Item } from "@mcbe/types/item";
import type { Manifest } from "@mcbe/types/manifest";
import { ensureDir } from "@std/fs";
import { dirname, join } from "@std/path";

export type BehaviorPackDefinition =
  | Block
  | Item
  | Feature
  | FeatureRule;

export class BehaviorPack {
  rootPath: string;

  blocks = new DefinitionSet(Block);
  items = new DefinitionSet(Item);
  features = new DefinitionSet(AggregateFeature, SingleBlockFeature);
  featureRules = new DefinitionSet(FeatureRule);
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
      } else if (
        def instanceof AggregateFeature ||
        def instanceof SingleBlockFeature
      ) {
        this.add(...def.resolveInstances());
        this.features.add(def);
      } else if (def instanceof FeatureRule) {
        this.add(...def.resolveInstances());
        this.featureRules.add(def);
      }
    }
  }

  async save(): Promise<void> {
    const tasks: Promise<void>[] = Array.from({
      length: 1 +
        this.blocks.size +
        this.items.size +
        this.features.size +
        this.featureRules.size,
    });

    tasks.push(
      writeJsonFile(join(this.rootPath, "manifest.json"), this.manifest),
    );

    for (const def of this.blocks) {
      const path = this.#createPath("blocks", def.identifier);
      tasks.push(writeJsonFile(path, def));
    }

    for (const def of this.items) {
      const path = this.#createPath("items", def.identifier);
      tasks.push(writeJsonFile(path, def));
    }

    for (const def of this.features) {
      const path = this.#createPath("features", def.identifier);
      tasks.push(writeJsonFile(path, def));
    }

    for (const def of this.featureRules) {
      const path = this.#createPath("feature_rules", def.identifier);
      tasks.push(writeJsonFile(path, def));
    }

    await Promise.all(tasks);
  }

  #createPath(directory: string, identifier: string): string {
    return join(
      this.rootPath,
      directory,
      identifier.split(":")[1] + ".json",
    );
  }
}

export class DefinitionSet<
  T extends BehaviorPackDefinition,
  // deno-lint-ignore no-explicit-any
  Constructors extends (new (...args: any[]) => T)[],
> extends Set<T> {
  #seen = new Set<string>();
  #constructors: Constructors;

  constructor(...constructors: Constructors) {
    super();
    this.#constructors = constructors;
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
    if (this.#constructors.some((ctor) => def instanceof ctor)) {
      return def.identifier;
    }
    const expectedCtors = this.#constructors
      .map((ctor) => ctor.name).join(", ");
    throw new TypeError(
      `Unknown definition: got ${def.constructor.name}, expected one of ${expectedCtors}`,
    );
  }
}

async function writeJsonFile(path: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await ensureDir(dirname(path));
  await Deno.writeTextFile(path, json);
}
