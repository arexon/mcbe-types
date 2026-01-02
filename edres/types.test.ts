import { assertEquals } from "@std/assert";
import { optimizeType, t } from "./types.ts";

Deno.test(`${optimizeType.name}()`, async (ctx) => {
  await ctx.step("union", () => {
    const type = t.union(
      t.string(),
      t.union(t.number(), t.array(t.boolean())),
    );
    optimizeType(type);
    assertEquals<unknown>(
      type,
      t.union(t.string(), t.number(), t.array(t.boolean())),
    );
  });

  await ctx.step("deeply nested unions", () => {
    const type = t.union(
      t.string(),
      t.array(t.union(
        t.boolean(),
        t.union(t.number(), t.object({ a: t.number() })),
      )),
    );
    optimizeType(type);
    assertEquals<unknown>(
      type,
      t.union(
        t.string(),
        t.array(t.union(
          t.boolean(),
          t.number(),
          t.object({ a: t.number() }),
        )),
      ),
    );
  });

  await ctx.step("inside optional", () => {
    const type = t.optional(
      t.union(t.string(), t.union(t.number(), t.array(t.boolean()))),
    );
    optimizeType(type);
    assertEquals<unknown>(
      type,
      t.optional(t.union(t.string(), t.number(), t.array(t.boolean()))),
    );
  });

  await ctx.step("inside tuple", () => {
    const type = t.tuple(
      t.union(t.string(), t.union(t.number(), t.array(t.boolean()))),
    );
    optimizeType(type);
    assertEquals<unknown>(
      type,
      t.tuple(t.union(t.string(), t.number(), t.array(t.boolean()))),
    );
  });

  await ctx.step("inside array", () => {
    const type = t.array(
      t.union(t.string(), t.union(t.number(), t.array(t.boolean()))),
    );
    optimizeType(type);
    assertEquals<unknown>(
      type,
      t.array(t.union(t.string(), t.number(), t.array(t.boolean()))),
    );
  });

  await ctx.step("inside object", () => {
    const type = t.object(
      {
        a: t.union(t.string(), t.union(t.number(), t.array(t.boolean()))),
        b: t.union(
          t.string(),
          t.union(
            t.number(),
            t.array(t.boolean()),
            t.union(t.number().max(10), t.boolean()),
          ),
        ),
      },
    );
    optimizeType(type);
    assertEquals<unknown>(
      type,
      t.object(
        {
          a: t.union(t.string(), t.number(), t.array(t.boolean())),
          b: t.union(
            t.string(),
            t.number(),
            t.array(t.boolean()),
            t.number().max(10),
            t.boolean(),
          ),
        },
      ),
    );
  });
});
