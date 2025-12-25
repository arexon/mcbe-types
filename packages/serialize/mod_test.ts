import { Serialize } from "@mcbe/serialize";
import { Validate, validate } from "@mcbe/validate";
import { assertRange } from "@mcbe/validate/assertions";
import { assertEquals } from "@std/assert";

function assertJSON(actual: unknown, expected: string): void {
  assertEquals(JSON.stringify(actual), expected);
}

Deno.test("basic", () => {
  @Serialize()
  class Foo {
    @Serialize()
    a = 8;

    @Serialize()
    b = "foo";
  }

  assertJSON(new Foo(), `{"a":8,"b":"foo"}`);
});

Deno.test("rename", () => {
  @Serialize()
  class Foo {
    @Serialize({ rename: "no" })
    yes = 1;
  }

  assertJSON(new Foo(), `{"no":1}`);
});

Deno.test("defaults", async (t) => {
  @Serialize()
  class Foo {
    @Serialize()
    noDefault = 8;

    @Serialize({ default: () => "foo" })
    primitive = "foo";

    @Serialize({ default: () => ["foo", "bar"] })
    object = ["foo", "bar"];
  }

  const v = new Foo();
  await t.step("all", () => {
    assertJSON(v, `{"no_default":8}`);
  });

  await t.step("primitive", () => {
    v.primitive = "qux";
    assertJSON(v, `{"no_default":8,"primitive":"qux"}`);
  });

  await t.step("object", () => {
    v.object.push("baz");
    assertJSON(
      v,
      `{"no_default":8,"primitive":"qux","object":["foo","bar","baz"]}`,
    );
  });
});

Deno.test("custom override", async (t) => {
  await t.step("normal", () => {
    @Serialize()
    class Foo {
      @Serialize({ custom: [(v) => ["custom", v], "normal"] })
      normal: string | string[] = "foo";

      @Serialize({
        custom: [(v) => ["custom", v], "normal"],
        default: () => ["custom", "foo"],
      })
      normalDefaulted: string | string[] = "foo";
    }

    const v = new Foo();
    assertJSON(v, `{"normal":["custom","foo"]}`);

    v.normalDefaulted = "bar";
    assertJSON(
      v,
      `{"normal":["custom","foo"],"normal_defaulted":["custom","bar"]}`,
    );
  });

  await t.step("merge", () => {
    @Serialize()
    class Foo {
      @Serialize()
      a = 1;

      @Serialize()
      b = 2;

      @Serialize({
        custom: [(v) => v, "merge"],
        default: () => ({ a: 10, c: 3 }),
      })
      merge = { a: 10, c: 3 };
    }

    const v = new Foo();
    assertJSON(v, `{"a":1,"b":2}`);

    v.merge.a = 12;
    assertJSON(v, `{"a":12,"b":2,"c":3}`);
  });
});

Deno.test("transparent", async (t) => {
  await t.step("with default", () => {
    @Serialize({ transparent: "basic" })
    class WithDefault {
      @Serialize()
      basic = "foo";

      @Serialize({ default: () => true })
      default = true;
    }

    const v = new WithDefault();
    assertJSON(v, `"foo"`);

    v.default = false;
    assertJSON(v, `{"basic":"foo","default":false}`);
  });

  await t.step("on default", () => {
    @Serialize({ transparent: "default" })
    class OnDefault {
      @Serialize({ default: () => true })
      default = true;
    }

    const v = new OnDefault();
    assertJSON(v, `true`);

    v.default = false;
    assertJSON(v, `false`);
  });

  await t.step("on custom (normal) + on default", () => {
    @Serialize({ transparent: "custom" })
    class OnCustom {
      @Serialize()
      basic? = "foo";

      @Serialize({
        custom: [(v) => ["custom", v], "normal"],
        default: () => ["custom", "foo"],
      })
      custom: string | string[] = "bar";
    }

    const v = new OnCustom();
    assertJSON(v, `{"basic":"foo","custom":["custom","bar"]}`);

    v.custom = "foo";
    assertJSON(v, `{"basic":"foo"}`);

    v.basic = undefined;
    assertJSON(v, `["custom","foo"]`);
  });

  await t.step("on custom (merge)", () => {
    @Serialize({ transparent: "custom" })
    class OnCustom {
      @Serialize()
      basic? = "foo";

      @Serialize({
        custom: [(v) => ({ merged: v }), "merge"],
        default: () => ({ merged: false }),
      })
      custom: boolean | object = false;
    }

    const v = new OnCustom();
    assertJSON(v, `{"basic":"foo"}`);

    v.custom = true;
    assertJSON(v, `{"basic":"foo","merged":true}`);

    v.basic = undefined;
    assertJSON(v, `{"merged":true}`);
  });

  await t.step("on getter", () => {
    @Serialize({ transparent: "name" })
    class OnGetter {
      get name(): string {
        return "foo";
      }
    }

    assertJSON(new OnGetter(), `"foo"`);
  });
});

Deno.test("nested", async (t) => {
  await t.step("basic", () => {
    @Serialize()
    class Parent {
      @Serialize()
      child = new Child();
    }

    @Serialize()
    class Child {
      @Serialize({ rename: "b" })
      a = "foo";
    }

    assertJSON(new Parent(), `{"child":{"b":"foo"}}`);
  });

  await t.step("transparent", () => {
    @Serialize({ transparent: "child" })
    class Parent {
      @Serialize()
      child = new Child();
    }

    @Serialize()
    class Child {
      @Serialize({ rename: "b" })
      a = "foo";
    }

    assertJSON(new Parent(), `{"b":"foo"}`);
  });
});

Deno.test("metadata compatibility", () => {
  @Serialize() @Validate()
  class Foo {
    @Serialize({ rename: "b" }) @Validate(assertRange(0, 1))
    a = 5;
  }

  const v = new Foo();
  assertEquals(validate(v), [
    {
      path: "Foo.a",
      reason: "5 is not between the range of 0..1",
    },
  ]);

  assertEquals(JSON.stringify(v), `{"b":5}`);
});
