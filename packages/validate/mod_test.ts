import { Validate, validate } from "@mcbe/validate";
import { assertRange } from "@mcbe/validate/assertions";
import { assertEquals } from "@std/assert";

Deno.test("basic", () => {
  @Validate()
  class Foo {
    @Validate((id) =>
      id.startsWith("#") ? undefined : { reason: 'Must start with "#"' }
    )
    id = "#foo";
  }

  const v = new Foo();
  assertEquals(validate(v), []);

  v.id = "foo";
  assertEquals(validate(v), [
    {
      path: "Foo.id",
      reason: 'Must start with "#"',
    },
  ]);
});

Deno.test("nested", () => {
  @Validate()
  class A {
    @Validate()
    b = new B();
  }

  @Validate()
  class B {
    @Validate(assertRange(4, 8))
    count = 32;

    @Validate()
    c = new C();
  }

  @Validate()
  class C {
    @Validate(assertRange(4, 8))
    count = 32;
  }

  assertEquals(validate(new A()), [
    {
      path: "A.b::B.count",
      reason: "32 is not between the range of 4..8",
    },
    {
      path: "A.b::B.c::C.count",
      reason: "32 is not between the range of 4..8",
    },
  ]);
});
