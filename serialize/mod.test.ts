import { Ser } from "@mcbe/serialize";
import { assertEquals } from "@std/assert";

function assertToJSON(actual: unknown, expected: string): void {
  assertEquals(JSON.stringify(actual), expected);
}

Deno.test("toJSON()", async (ctx) => {
  await ctx.step("empty", () => {
    @Ser()
    class Foo {}

    assertToJSON(new Foo(), `{}`);
  });

  await ctx.step("basic", () => {
    @Ser()
    class Foo {
      @Ser()
      a = 8;

      @Ser()
      b = "foo";
    }

    assertToJSON(new Foo(), `{"a":8,"b":"foo"}`);
  });

  await ctx.step("special field names", () => {
    @Ser()
    class Foo {
      @Ser()
      "*" = 0;

      @Ser()
      "$" = 0;

      @Ser()
      "10" = 0;

      @Ser()
      "a:bB" = 0;
    }

    assertToJSON(new Foo(), `{"10":0,"*":0,"$":0,"a:bB":0}`);
  });

  await ctx.step("rename", async (ctx) => {
    await ctx.step("basic", () => {
      @Ser()
      class Foo {
        @Ser({ rename: "no" })
        yes = 1;
      }

      assertToJSON(new Foo(), `{"no":1}`);
    });

    await ctx.step("with custom override merge", () => {
      @Ser()
      class Foo {
        @Ser({ rename: "no" })
        yes = 1;

        @Ser({ custom: [(v) => ({ no: v + 20 }), "merge"] })
        merge = 1;
      }

      assertToJSON(new Foo(), `{"no":21}`);
    });
  });

  await ctx.step("defaults", async (ctx) => {
    @Ser()
    class Foo {
      @Ser()
      noDefault = 8;

      @Ser({ default: () => "foo" })
      primitive = "foo";

      @Ser({ default: () => ["foo", "bar"] })
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
      @Ser()
      class Foo {
        @Ser({
          custom: [(v) => ["custom", v], "normal"],
        })
        normal: string | string[] = "foo";

        @Ser({
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
      @Ser()
      class Foo {
        @Ser()
        a = 1;

        @Ser()
        b = 2;

        @Ser({
          custom: [(v) => v, "merge"],
          default: () => ({ a: 10, c: 3 }),
        })
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
      @Ser({ transparent: "basic" })
      class WithDefault {
        @Ser()
        basic = "foo";

        @Ser({ default: () => true })
        default = true;
      }

      const v = new WithDefault();
      assertToJSON(v, `"foo"`);

      v.default = false;
      assertToJSON(v, `{"basic":"foo","default":false}`);
    });

    await ctx.step("on default", () => {
      @Ser({ transparent: "default" })
      class OnDefault {
        @Ser({ default: () => true })
        default = true;
      }

      const v = new OnDefault();
      assertToJSON(v, `true`);

      v.default = false;
      assertToJSON(v, `false`);
    });

    await ctx.step("on custom (normal) + on default", () => {
      @Ser({ transparent: "custom" })
      class OnCustom {
        @Ser()
        basic? = "foo";

        @Ser({
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
      @Ser({ transparent: "custom" })
      class OnCustom {
        @Ser()
        basic? = "foo";

        @Ser({
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
      @Ser({ transparent: "name" })
      class OnGetter {
        get name(): string {
          return "foo";
        }
      }

      assertToJSON(new OnGetter(), `"foo"`);
    });
  });

  await ctx.step("path", async (ctx) => {
    await ctx.step("basic", () => {
      @Ser()
      class Foo {
        @Ser({ path: "root:foo/bar" })
        a = 1;

        @Ser({ path: "root:foo/baz/quux" })
        b = 2;
      }

      assertToJSON(
        new Foo(),
        `{"root:foo":{"bar":{"a":1},"baz":{"quux":{"b":2}}}}`,
      );
    });

    await ctx.step("rename + custom", () => {
      @Ser()
      class Foo {
        @Ser({
          path: "root:foo",
          rename: "__rename__",
        })
        rename = 1;

        @Ser({
          path: "root:foo/bar",
          rename: "__rename__",
          custom: [(v) => v, "merge"],
        })
        renameWithCustomMerge = { merge: 1 };

        @Ser({
          path: "root:foo/bar",
          rename: "__rename__",
          custom: [(v) => v, "normal"],
        })
        renameWithCustomNormal = { normal: 1 };
      }

      assertToJSON(
        new Foo(),
        `{"root:foo":{"__rename__":1,"bar":{"merge":1,"__rename__":{"normal":1}}}}`,
      );
    });

    await ctx.step("transparent", () => {
      @Ser({ transparent: "value" })
      class Foo {
        @Ser({ path: "root:foo/bar" })
        value = 1;
      }

      assertToJSON(new Foo(), `1`);
    });
  });

  await ctx.step("nested", async (ctx) => {
    await ctx.step("basic", () => {
      @Ser()
      class Child {
        @Ser({ rename: "b" })
        a = "foo";
      }

      @Ser()
      class Parent {
        @Ser()
        child = new Child();
      }

      assertToJSON(new Parent(), `{"child":{"b":"foo"}}`);
    });

    await ctx.step("transparent", () => {
      @Ser()
      class Child {
        @Ser({ rename: "b" })
        a = "foo";
      }

      @Ser({ transparent: "child" })
      class Parent {
        @Ser()
        child = new Child();
      }

      assertToJSON(new Parent(), `{"b":"foo"}`);
    });
  });
});
