import { SerClass, SerField } from "@mcbe/serialize";
import { assertEquals } from "@std/assert";

Deno.test("basic serialization", () => {
  @SerClass()
  class Foo {
    @SerField()
    a: number;

    @SerField()
    b?: string;

    constructor() {
      this.a = 8;
    }
  }

  assertEquals(JSON.stringify(new Foo()), `{"a":8}`);
});

Deno.test("serialization with defaults", () => {
  @SerClass()
  class Foo {
    @SerField()
    a: number;

    @SerField({ default: (value) => value === "hi" })
    b: string;

    constructor() {
      this.a = 8;
      this.b = "hi";
    }
  }

  const foo = new Foo();
  assertEquals(JSON.stringify(foo), `{"a":8}`);

  foo.b = "hey";
  assertEquals(JSON.stringify(foo), `{"a":8,"b":"hey"}`);

  foo.b = "hi";
  assertEquals(JSON.stringify(foo), `{"a":8}`);
});

Deno.test("serialization with transparency", () => {
  @SerClass({ transparent: "a" })
  class Foo {
    @SerField()
    a: string;

    @SerField()
    b?: number;

    @SerField({ default: (value) => value === true })
    c: boolean;

    constructor() {
      this.a = "apple";
      this.c = true;
    }
  }

  const foo = new Foo();
  assertEquals(JSON.stringify(foo), `"apple"`);

  foo.b = 3;
  assertEquals(JSON.stringify(foo), `{"a":"apple","b":3}`);

  foo.b = undefined;
  foo.c = false;
  assertEquals(JSON.stringify(foo), `{"a":"apple","c":false}`);
});

Deno.test("serialization with custom overrides", () => {
  @SerClass()
  class Foo {
    @SerField({ custom: (a) => `extra_thing:${a}` })
    a: string;

    constructor() {
      this.a = "apple";
    }
  }

  assertEquals(JSON.stringify(new Foo()), `{"a":"extra_thing:apple"}`);
});

Deno.test("serialization with transparency and custom overrides", () => {
  @SerClass({ transparent: "a" })
  class Foo {
    @SerField({ custom: (a) => `extra_thing:${a}` })
    a: string;

    constructor() {
      this.a = "apple";
    }
  }

  assertEquals(JSON.stringify(new Foo()), `"extra_thing:apple"`);
});

Deno.test("serialization with transparency, default, and custom overrides", () => {
  @SerClass({ transparent: "a" })
  class Foo {
    @SerField({
      default: (a) => a === "apple",
      custom: (a) => `extra_thing:${a}`,
    })
    a: string;

    constructor() {
      this.a = "apple";
    }
  }

  const foo = new Foo();
  assertEquals(JSON.stringify(foo), `"extra_thing:apple"`);

  foo.a = "orange";
  assertEquals(JSON.stringify(foo), `"extra_thing:orange"`);
});

Deno.test("serialization with rename", () => {
  @SerClass()
  class Foo {
    @SerField({ rename: "_a_" })
    a: string;

    constructor() {
      this.a = "apple";
    }
  }

  assertEquals(JSON.stringify(new Foo()), `{"_a_":"apple"}`);
});
