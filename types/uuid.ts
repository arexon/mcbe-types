import { crypto } from "@std/crypto";

export type Uuid = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Deterministic UUID v4 generator based on a seed string.
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const uuid = new SeededUuid("my-seed");
 * assertEquals(uuid.generate(), "517473e8-77ef-4d0c-83ac-d36fce2e59e4");
 * assertEquals(uuid.generate(), "86f719d1-41b1-4c6d-af41-9f8b50177bfc");
 * ```
 */
// deno-lint-ignore style-guide/class-serialization
export class SeededUuid {
  #counter = 0;
  #seed: string;

  constructor(seed: string) {
    this.#seed = seed;
  }

  /** Returns a new UUID v4 based on the seed and an internal counter. */
  generate(): Uuid {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${this.#seed}-${this.#counter}`);
    const hash = crypto.subtle.digestSync("SHA-256", data);
    const bytes = new Uint8Array(hash).slice(0, 16);

    // Set UUID version to 4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set UUID variant to RFC 4122
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    this.#counter++;

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join("-") as Uuid;
  }
}
