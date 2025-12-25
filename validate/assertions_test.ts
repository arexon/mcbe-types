import { assertRange } from "@mcbe/validate/assertions";
import { assertEquals } from "@std/assert";

Deno.test("assertRange", async (t) => {
  await t.step("start..end", () => {
    const fn = assertRange(0, 15);

    assertEquals(fn(), undefined);

    assertEquals(fn(14), undefined);

    assertEquals(fn(15), { reason: "15 is not between the range of 0..15" });
  });

  await t.step("start..end", () => {
    const fn = assertRange(0, 15, true);

    assertEquals(fn(15), undefined);

    assertEquals(fn(16), { reason: "16 is not between the range of 0..=15" });
  });
});
