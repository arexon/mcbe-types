import { toSnakeCase } from "@std/text/to-snake-case";
import type { FieldOptions } from "./mod.ts";
import { type EdresType, optimizeType } from "./types.ts";

const SPECIAL_CHARACTERS_REGEXP = /[$&+,:;=?@#|'<>.^*()%!-]/;

export const FIELDS_METADATA = Symbol();
export const FIELDS_METADATA_VAR_NAME = "fieldsMetadata";

export function getMetadataFrom(
  target: "ctor" | "this",
  name: string,
  data: string,
): string {
  let targetStr;
  switch (target) {
    case "ctor":
      targetStr = "ctor";
      break;
    case "this":
      targetStr = "this.constructor";
      break;
  }
  return `${targetStr}[Symbol.metadata][${FIELDS_METADATA_VAR_NAME}].get("${name}")${
    data === "" ? "" : "." + data
  }`;
}

export interface FieldMetadata {
  index: number;
  name: string;
  type: EdresType;
  default?: () => unknown;
  custom?: { fn: (value: unknown) => unknown; strategy: "normal" | "merge" };
  rename?: string;
}

export class FieldsMetadata {
  length = 0;
  #fields: Record<string, FieldMetadata> = {};

  set(name: string, type: EdresType, options: FieldOptions<unknown>): void {
    if (type.kind === "custom") {
      if (
        !("fromJSON" in type.inner && typeof type.inner.fromJSON === "function")
      ) {
        throw new TypeError("Constructor has no `fromJSON()` method");
      }
    }

    optimizeType(type);

    this.#fields[name] = {
      index: this.length,
      name,
      type,
      custom: options.custom !== undefined
        ? { fn: options.custom[0], strategy: options.custom[1] }
        : undefined,
      default: options.default,
      rename: options.rename,
    };
    this.length++;
  }

  get(name: string): FieldMetadata | undefined {
    return this.#fields[name];
  }

  getKey(name: string): string {
    const field = this.#fields[name]!;
    if (field.rename !== undefined) {
      return field.rename;
    } else if (!SPECIAL_CHARACTERS_REGEXP.test(field.name)) {
      return toSnakeCase(field.name);
    } else {
      return field.name;
    }
  }

  *[Symbol.iterator](): Generator<FieldMetadata> {
    for (const [_, field] of Object.entries(this.#fields)) {
      yield field;
    }
  }
}
