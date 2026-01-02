import { deserialize, Edres, t } from "@mcbe/edres";
import { type AnyConstructor, assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";

function assertToJSON(actual: unknown, expected: string): void {
  assertEquals(JSON.stringify(actual), expected);
}

async function snapshotFromJSON<T extends AnyConstructor>(
  ctx: Deno.TestContext,
  ctor: T,
  input: Record<string, unknown>,
): Promise<void> {
  await assertSnapshot(ctx, deserialize(JSON.stringify(input), ctor));
}

Deno.test("toJSON()", async (ctx) => {
  await ctx.step("basic", () => {
    @Edres()
    class Foo {
      @Edres(t.number())
      a = 8;

      @Edres(t.string())
      b = "foo";
    }

    assertToJSON(new Foo(), `{"a":8,"b":"foo"}`);
  });

  await ctx.step("special field names", () => {
    @Edres()
    class Foo {
      @Edres(t.number())
      "*" = 0;

      @Edres(t.number())
      "$" = 0;

      @Edres(t.number())
      "10" = 0;

      @Edres(t.number())
      "a:bB" = 0;
    }

    assertToJSON(new Foo(), `{"10":0,"*":0,"$":0,"a:bB":0}`);
  });

  await ctx.step("rename", async (ctx) => {
    await ctx.step("basic", () => {
      @Edres()
      class Foo {
        @Edres(t.number(), { rename: "no" })
        yes = 1;
      }

      assertToJSON(new Foo(), `{"no":1}`);
    });

    await ctx.step("with custom override merge", () => {
      @Edres()
      class Foo {
        @Edres(t.number(), { rename: "no" })
        yes = 1;

        @Edres(t.number(), { custom: [(v) => ({ no: v + 20 }), "merge"] })
        merge = 1;
      }

      assertToJSON(new Foo(), `{"no":21}`);
    });
  });

  await ctx.step("defaults", async (ctx) => {
    @Edres()
    class Foo {
      @Edres(t.number())
      noDefault = 8;

      @Edres(t.string(), { default: () => "foo" })
      primitive = "foo";

      @Edres(t.array(t.string()), { default: () => ["foo", "bar"] })
      object = ["foo", "bar"];
    }

    const v = new Foo();
    await ctx.step("all", () => {
      assertToJSON(v, `{"no_default":8}`);
    });

    await ctx.step("primitive", () => {
      v.primitive = "qux";
      assertToJSON(v, `{"no_default":8,"primitive":"qux"}`);
    });

    await ctx.step("object", () => {
      v.object.push("baz");
      assertToJSON(
        v,
        `{"no_default":8,"primitive":"qux","object":["foo","bar","baz"]}`,
      );
    });
  });

  await ctx.step("custom override", async (ctx) => {
    await ctx.step("normal", () => {
      @Edres()
      class Foo {
        @Edres(t.union(t.string(), t.array(t.string())), {
          custom: [(v) => ["custom", v], "normal"],
        })
        normal: string | string[] = "foo";

        @Edres(t.union(t.string(), t.array(t.string())), {
          custom: [(v) => ["custom", v], "normal"],
          default: () => ["custom", "foo"],
        })
        normalDefaulted: string | string[] = "foo";
      }

      const v = new Foo();
      assertToJSON(v, `{"normal":["custom","foo"]}`);

      v.normalDefaulted = "bar";
      assertToJSON(
        v,
        `{"normal":["custom","foo"],"normal_defaulted":["custom","bar"]}`,
      );
    });

    await ctx.step("merge", () => {
      @Edres()
      class Foo {
        @Edres(t.number())
        a = 1;

        @Edres(t.number())
        b = 2;

        @Edres(
          t.object({ a: t.number(), c: t.number() }),
          {
            custom: [(v) => v, "merge"],
            default: () => ({ a: 10, c: 3 }),
          },
        )
        merge = { a: 10, c: 3 };
      }

      const v = new Foo();
      assertToJSON(v, `{"a":1,"b":2}`);

      v.merge.a = 12;
      assertToJSON(v, `{"a":12,"b":2,"c":3}`);
    });
  });

  await ctx.step("transparent", async (ctx) => {
    await ctx.step("with default", () => {
      @Edres({ transparent: "basic" })
      class WithDefault {
        @Edres(t.string())
        basic = "foo";

        @Edres(t.boolean(), { default: () => true })
        default = true;
      }

      const v = new WithDefault();
      assertToJSON(v, `"foo"`);

      v.default = false;
      assertToJSON(v, `{"basic":"foo","default":false}`);
    });

    await ctx.step("on default", () => {
      @Edres({ transparent: "default" })
      class OnDefault {
        @Edres(t.boolean(), { default: () => true })
        default = true;
      }

      const v = new OnDefault();
      assertToJSON(v, `true`);

      v.default = false;
      assertToJSON(v, `false`);
    });

    await ctx.step("on custom (normal) + on default", () => {
      @Edres({ transparent: "custom" })
      class OnCustom {
        @Edres(t.optional(t.string()))
        basic? = "foo";

        @Edres(t.union(t.string(), t.array(t.string())), {
          custom: [(v) => ["custom", v], "normal"],
          default: () => ["custom", "foo"],
        })
        custom: string | string[] = "bar";
      }

      const v = new OnCustom();
      assertToJSON(v, `{"basic":"foo","custom":["custom","bar"]}`);

      v.custom = "foo";
      assertToJSON(v, `{"basic":"foo"}`);

      v.basic = undefined;
      assertToJSON(v, `["custom","foo"]`);
    });

    await ctx.step("on custom (merge)", () => {
      @Edres({ transparent: "custom" })
      class OnCustom {
        @Edres(t.optional(t.string()))
        basic? = "foo";

        @Edres(t.union(t.boolean(), t.object({ merged: t.boolean() })), {
          custom: [(v) => ({ merged: v }), "merge"],
          default: () => ({ merged: false }),
        })
        custom: boolean | { merged: boolean } = false;
      }

      const v = new OnCustom();
      assertToJSON(v, `{"basic":"foo"}`);

      v.custom = true;
      assertToJSON(v, `{"basic":"foo","merged":true}`);

      v.basic = undefined;
      assertToJSON(v, `{"merged":true}`);
    });

    await ctx.step("on getter", () => {
      @Edres({ transparent: "name" })
      class OnGetter {
        get name(): string {
          return "foo";
        }
      }

      assertToJSON(new OnGetter(), `"foo"`);
    });
  });

  await ctx.step("nested", async (ctx) => {
    await ctx.step("basic", () => {
      @Edres()
      class Child {
        @Edres(t.string(), { rename: "b" })
        a = "foo";
      }

      @Edres()
      class Parent {
        @Edres(t.custom(Child))
        child = new Child();
      }

      assertToJSON(new Parent(), `{"child":{"b":"foo"}}`);
    });

    await ctx.step("transparent", () => {
      @Edres()
      class Child {
        @Edres(t.string(), { rename: "b" })
        a = "foo";
      }

      @Edres({ transparent: "child" })
      class Parent {
        @Edres(t.custom(Child))
        child = new Child();
      }

      assertToJSON(new Parent(), `{"b":"foo"}`);
    });
  });
});

Deno.test("fromJSON()", async (ctx) => {
  // NOTE: We do not care about the initial field values, so we just assign them to whatever.

  await ctx.step("numbers", async (ctx) => {
    @Edres()
    class Number {
      @Edres(t.number().gt(0).lt(5))
      a = 0;

      @Edres(t.number().gte(0).lt(5))
      b = 0;

      @Edres(t.number().gte(0).lte(5))
      c = 0;

      @Edres(t.number().gt(0).lte(5))
      d = 0;
    }

    await snapshotFromJSON(ctx, Number, {
      a: 2.5,
      b: 2.5,
      c: 2.5,
      d: 2.5,
    });

    await snapshotFromJSON(ctx, Number, {
      a: 0.1,
      b: 0,
      c: 0,
      d: 0.1,
    });

    await snapshotFromJSON(ctx, Number, {
      a: 4.9,
      b: 4.9,
      c: 5,
      d: 5,
    });

    await snapshotFromJSON(ctx, Number, {
      a: 0,
      b: -1,
      c: -1,
      d: 0,
    });

    await snapshotFromJSON(ctx, Number, {
      a: 5,
      b: 5,
      c: 6,
      d: 6,
    });

    await snapshotFromJSON(ctx, Number, {});
  });

  await ctx.step("booleans", async (ctx) => {
    @Edres()
    class Boolean {
      @Edres(t.boolean())
      a = false;

      @Edres(t.optional(t.boolean()))
      b = undefined;
    }

    await snapshotFromJSON(ctx, Boolean, { a: true, b: false });
    await snapshotFromJSON(ctx, Boolean, { a: false, b: true });
    await snapshotFromJSON(ctx, Boolean, { a: "wrong", b: "wrong" });
    await snapshotFromJSON(ctx, Boolean, {});
  });

  await ctx.step("strings", async (ctx) => {
    @Edres()
    class Strings {
      @Edres(t.string())
      a = "foo";

      @Edres(t.optional(t.string()))
      b = undefined;
    }

    await snapshotFromJSON(ctx, Strings, { a: "foo", b: "foo" });
    await snapshotFromJSON(ctx, Strings, { a: 0, b: 0 });
    await snapshotFromJSON(ctx, Strings, {});
  });

  await ctx.step("literals", async (ctx) => {
    @Edres()
    class Literals {
      @Edres(t.literal("foo"))
      a = "foo";

      @Edres(t.optional(t.literal("foo")))
      b = undefined;
    }

    await snapshotFromJSON(ctx, Literals, { a: "foo", b: "foo" });
    await snapshotFromJSON(ctx, Literals, { a: 0, b: 0 });
    await snapshotFromJSON(ctx, Literals, {});
  });

  await ctx.step("arrays", async (ctx) => {
    @Edres()
    class Arrays {
      @Edres(t.array(t.string()))
      a = ["foo"];

      @Edres(t.optional(t.array(t.string())))
      b = undefined;
    }

    await snapshotFromJSON(ctx, Arrays, { a: ["foo", "bar"], b: [] });
    await snapshotFromJSON(ctx, Arrays, { a: ["foo", 1], b: {} });
    await snapshotFromJSON(ctx, Arrays, {});
  });

  await ctx.step("unions", async (ctx) => {
    @Edres()
    class Unions {
      @Edres(t.union(t.string(), t.number()))
      a = 0;

      @Edres(t.optional(t.union(t.string(), t.number())))
      b = undefined;
    }

    await snapshotFromJSON(ctx, Unions, { a: 0, b: "foo" });
    await snapshotFromJSON(ctx, Unions, { a: true, b: [] });
    await snapshotFromJSON(ctx, Unions, {});
  });

  await ctx.step("arrays + unions", async (ctx) => {
    @Edres()
    class ArraysUnions {
      @Edres(t.array(t.union(t.string(), t.number())))
      a = 0;

      @Edres(t.optional(t.array(t.union(t.string(), t.number()))))
      b = undefined;
    }

    await snapshotFromJSON(ctx, ArraysUnions, {
      a: [0, "foo"],
      b: [0, "foo", 1, "bar"],
    });
    await snapshotFromJSON(ctx, ArraysUnions, { a: {}, b: [true, "foo"] });
    await snapshotFromJSON(ctx, ArraysUnions, {});
  });

  await ctx.step("tuples", async (ctx) => {
    @Edres()
    class Tuples {
      @Edres(t.tuple(t.string(), t.number(), t.literal("one")))
      a = ["foo", 0, "one"];

      @Edres(t.optional(t.tuple(t.string(), t.number(), t.literal("one"))))
      b = undefined;
    }

    await snapshotFromJSON(ctx, Tuples, {
      a: ["foo", 0, "one"],
      b: ["bar", 1, "one"],
    });
    await snapshotFromJSON(ctx, Tuples, {
      a: [3, 10, 20],
      b: [true, false, "a"],
    });
    await snapshotFromJSON(ctx, Tuples, { a: [], b: {} });
    await snapshotFromJSON(ctx, Tuples, {});
  });

  await ctx.step("tuples + unions", async (ctx) => {
    @Edres()
    class TuplesUnions {
      @Edres(t.tuple(
        t.union(t.literal("A1"), t.literal("A2")),
        t.union(t.literal("B1"), t.literal("B2")),
      ))
      a = ["A1", "B1"];

      @Edres(t.optional(t.tuple(
        t.union(t.literal("A1"), t.literal("A2")),
        t.union(t.literal("B1"), t.literal("B2")),
      )))
      b = undefined;
    }

    await snapshotFromJSON(ctx, TuplesUnions, {
      a: ["A1", "B2"],
      b: ["A2", "B1"],
    });
    await snapshotFromJSON(ctx, TuplesUnions, { a: [1, 2], b: [false] });
    await snapshotFromJSON(ctx, TuplesUnions, { a: [], b: {} });
    await snapshotFromJSON(ctx, TuplesUnions, {});
  });

  await ctx.step("objects", async (ctx) => {
    @Edres()
    class Objects {
      @Edres(t.object({
        a: t.string(),
        b: t.number(),
      }))
      a = {};

      @Edres(t.optional(t.object({
        a: t.string(),
        b: t.number(),
      })))
      b = {};
    }

    await snapshotFromJSON(ctx, Objects, {
      a: { a: "foo", b: 0 },
      b: { a: "bar", b: 1 },
    });
    await snapshotFromJSON(ctx, Objects, {
      a: { a: true, b: "wrong" },
      b: 0,
    });
    await snapshotFromJSON(ctx, Objects, {});
  });

  await ctx.step("custom", async (ctx) => {
    @Edres()
    class A {}

    @Edres()
    class B {
      @Edres(t.number())
      number = 0;
    }

    @Edres()
    class Custom {
      @Edres(t.custom(A))
      a = new A();

      @Edres(t.custom(B))
      b = new B();

      @Edres(t.optional(t.custom(B)))
      c = undefined;
    }

    await snapshotFromJSON(ctx, Custom, {
      a: {},
      b: { number: 0 },
      c: { number: 0 },
    });
    await snapshotFromJSON(ctx, Custom, {
      a: 0,
      b: { number: "foo" },
      c: { number: "bar" },
    });
    await snapshotFromJSON(ctx, Custom, { a: "wrong", b: {} });
    await snapshotFromJSON(ctx, Custom, {});
  });

  await ctx.step("complex custom", async (ctx) => {
    @Edres()
    class A {
      @Edres(t.string())
      name = "foo";
    }

    @Edres()
    class B {
      @Edres(t.number())
      number = 0;
    }

    @Edres()
    class Complex {
      @Edres(t.array(t.custom(A)))
      array = [new A()];

      @Edres(t.array(t.union(t.custom(A), t.custom(B))))
      arrayUnion = [new A(), new B()];

      @Edres(t.union(t.custom(A), t.custom(B)))
      union = new A();

      @Edres(t.tuple(t.custom(A), t.custom(B)))
      tuple = [new A(), new B()];

      @Edres(t.tuple(
        t.union(t.custom(A), t.custom(B)),
        t.array(t.union(t.custom(A), t.custom(B))),
      ))
      tupleUnion = [new A(), [new B()]];
    }

    await snapshotFromJSON(ctx, Complex, {
      array: [{ name: "a" }],
      array_union: [{ name: "a" }, { number: 0 }],
      union: { name: "a" },
      tuple: [{ name: "a" }, { number: 0 }],
      tuple_union: [{ name: "a" }, [{ number: 0 }, { number: 1 }]],
    });
    await snapshotFromJSON(ctx, Complex, {
      array: [1],
      array_union: ["a", {}],
      union: { name: 1 },
      tuple: [undefined, { number: 0 }],
      tuple_union: [{ name: 0 }, [1]],
    });
    await snapshotFromJSON(ctx, Complex, {});
  });
});
