import { Edres } from "@mcbe/edres";
import { assertEquals } from "@std/assert";

function assertToJSON(actual: unknown, expected: string): void {
  assertEquals(JSON.stringify(actual), expected);
}

Deno.test("toJSON()", async (ctx) => {
  await ctx.step("empty", () => {
    @Edres()
    class Foo {}

    assertToJSON(new Foo(), `{}`);
  });

  await ctx.step("basic", () => {
    @Edres()
    class Foo {
      @Edres()
      a = 8;

      @Edres()
      b = "foo";
    }

    assertToJSON(new Foo(), `{"a":8,"b":"foo"}`);
  });

  await ctx.step("special field names", () => {
    @Edres()
    class Foo {
      @Edres()
      "*" = 0;

      @Edres()
      "$" = 0;

      @Edres()
      "10" = 0;

      @Edres()
      "a:bB" = 0;
    }

    assertToJSON(new Foo(), `{"10":0,"*":0,"$":0,"a:bB":0}`);
  });

  await ctx.step("rename", async (ctx) => {
    await ctx.step("basic", () => {
      @Edres()
      class Foo {
        @Edres({ rename: "no" })
        yes = 1;
      }

      assertToJSON(new Foo(), `{"no":1}`);
    });

    await ctx.step("with custom override merge", () => {
      @Edres()
      class Foo {
        @Edres({ rename: "no" })
        yes = 1;

        @Edres({ custom: [(v) => ({ no: v + 20 }), "merge"] })
        merge = 1;
      }

      assertToJSON(new Foo(), `{"no":21}`);
    });
  });

  await ctx.step("defaults", async (ctx) => {
    @Edres()
    class Foo {
      @Edres()
      noDefault = 8;

      @Edres({ default: () => "foo" })
      primitive = "foo";

      @Edres({ default: () => ["foo", "bar"] })
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
        @Edres({
          custom: [(v) => ["custom", v], "normal"],
        })
        normal: string | string[] = "foo";

        @Edres({
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
        @Edres()
        a = 1;

        @Edres()
        b = 2;

        @Edres({
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
      @Edres({ transparent: "basic" })
      class WithDefault {
        @Edres()
        basic = "foo";

        @Edres({ default: () => true })
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
        @Edres({ default: () => true })
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
        @Edres()
        basic? = "foo";

        @Edres({
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
        @Edres()
        basic? = "foo";

        @Edres({
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
        @Edres({ rename: "b" })
        a = "foo";
      }

      @Edres()
      class Parent {
        @Edres()
        child = new Child();
      }

      assertToJSON(new Parent(), `{"child":{"b":"foo"}}`);
    });

    await ctx.step("transparent", () => {
      @Edres()
      class Child {
        @Edres({ rename: "b" })
        a = "foo";
      }

      @Edres({ transparent: "child" })
      class Parent {
        @Edres()
        child = new Child();
      }

      assertToJSON(new Parent(), `{"b":"foo"}`);
    });
  });
});
