import { SerClass, SerField } from "@mcbe/serialize";
import { assertEquals } from "@std/assert";

function assertJSON(actual: unknown, expected: string): void {
  assertEquals(JSON.stringify(actual), expected);
}

Deno.test("basic", () => {
  @SerClass()
  class Foo {
    @SerField()
    a = 8;

    @SerField()
    b = "foo";
  }

  assertJSON(new Foo(), `{"a":8,"b":"foo"}`);
});

Deno.test("rename", () => {
  @SerClass()
  class Foo {
    @SerField({ rename: "no" })
    yes = 1;
  }

  assertJSON(new Foo(), `{"no":1}`);
});

Deno.test("defaults", async (t) => {
  @SerClass()
  class Foo {
    @SerField()
    noDefault = 8;

    @SerField({ default: () => "foo" })
    primitive = "foo";

    @SerField({ default: () => ["foo", "bar"] })
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
    @SerClass()
    class Foo {
      @SerField({ custom: [(v) => ["custom", v], "normal"] })
      normal: string | string[] = "foo";

      @SerField({
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
    @SerClass()
    class Foo {
      @SerField()
      a = 1;

      @SerField()
      b = 2;

      @SerField({
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
    @SerClass({ transparent: "basic" })
    class WithDefault {
      @SerField()
      basic = "foo";

      @SerField({ default: () => true })
      default = true;
    }

    const v = new WithDefault();
    assertJSON(v, `"foo"`);

    v.default = false;
    assertJSON(v, `{"basic":"foo","default":false}`);
  });

  await t.step("on default", () => {
    @SerClass({ transparent: "default" })
    class OnDefault {
      @SerField({ default: () => true })
      default = true;
    }

    const v = new OnDefault();
    assertJSON(v, `true`);

    v.default = false;
    assertJSON(v, `false`);
  });

  await t.step("on custom (normal) + on default", () => {
    @SerClass({ transparent: "custom" })
    class OnCustom {
      @SerField()
      basic? = "foo";

      @SerField({
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
    @SerClass({ transparent: "custom" })
    class OnCustom {
      @SerField()
      basic? = "foo";

      @SerField({
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
    @SerClass({ transparent: "name" })
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
    @SerClass()
    class Parent {
      @SerField()
      child = new Child();
    }

    @SerClass()
    class Child {
      @SerField({ rename: "b" })
      a = "foo";
    }

    assertJSON(new Parent(), `{"child":{"b":"foo"}}`);
  });

  await t.step("transparent", () => {
    @SerClass({ transparent: "child" })
    class Parent {
      @SerField()
      child = new Child();
    }

    @SerClass()
    class Child {
      @SerField({ rename: "b" })
      a = "foo";
    }

    assertJSON(new Parent(), `{"b":"foo"}`);
  });
});
