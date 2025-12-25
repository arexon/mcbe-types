/**
 * Builtin assertion helpers for various scenarios.
 *
 * @module
 */

import type { AssertionResult } from "@mcbe/validate";

/**
 * Defines an assertion function for a range bounded between `start..(=)end`.
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { assertRange } from "@mcbe/validate/assertions";
 *
 * assertEquals(assertRange(0, 15)(20), { reason: "20 is not between the range of 0..15" });
 * ```
 *
 * @returns The assertion function
 */
export function assertRange(
  start: number,
  end: number,
  inclusive: boolean = false,
): (x?: number) => AssertionResult {
  return (x) => {
    if (x === undefined) return;
    if (!(x >= start && (inclusive ? x <= end : x < end))) {
      return {
        reason: `${x} is not between the range of ${start}..${
          inclusive ? "=" : ""
        }${end}`,
      };
    }
  };
}
