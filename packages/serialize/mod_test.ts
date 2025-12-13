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

  assertEquals(
    JSON.stringify(new Foo()),
    `{"a":8}`,
    "should serialize",
  );
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
  assertEquals(
    JSON.stringify(foo),
    `{"a":8}`,
    "should skip since field is undefined",
  );

  foo.b = "hey";
  assertEquals(
    JSON.stringify(foo),
    `{"a":8,"b":"hey"}`,
    "should not skip since field does not match default value",
  );

  foo.b = "hi";
  assertEquals(
    JSON.stringify(foo),
    `{"a":8}`,
    "should skip since field matches default value",
  );
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
  assertEquals(
    JSON.stringify(foo),
    `"apple"`,
    "should directly serialize field since other fields are undefined",
  );

  foo.b = 3;
  assertEquals(
    JSON.stringify(foo),
    `{"a":"apple","b":3}`,
    "should serialize entire object since all fields are present",
  );

  foo.b = undefined;
  foo.c = false;
  assertEquals(
    JSON.stringify(foo),
    `{"a":"apple","c":false}`,
    "should serialize entire object since field does not match default value",
  );
});
