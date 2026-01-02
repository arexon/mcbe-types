import { assertEquals } from "@std/assert";
import plugin from "./lint.ts";

function assertDiagnostics(
  source: string,
  expectedDiagnostics: Deno.lint.Diagnostic[],
) {
  const actualDiagnostics = Deno.lint.runPlugin(
    plugin,
    "mcbe-types/types/mod.ts",
    source,
  );
  assertEquals(actualDiagnostics, expectedDiagnostics);
}

Deno.test("style-guide/class-serialization", () => {
  // Bad
  assertDiagnostics(
    `
export class Foo {
  a = 1;
}
    `,
    [
      {
        id: "style-guide/class-serialization",
        message: "The class is not annotated with the `@Ser` decorator",
        hint: "Annotate the class with `@Ser()` to enable smart serialization",
        range: [14, 17],
        fix: [{ range: [1, 1], text: "@Ser() " }],
      },
      {
        id: "style-guide/class-serialization",
        message: "The field is not annotated with the `@Ser` decorator",
        hint: "Annotate the field with `@Ser()` to enable smart serialization",
        range: [22, 28],
        fix: [{ range: [22, 22], text: "@Ser() " }],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Ser()
export class Foo {
  @Ser()
  a = 1;
}
    `,
    [],
  );

  // Bad
  assertDiagnostics(
    `
@Ser()
export class Foo {
  @Ser({ default: () => 1 })
  a?;
}
    `,
    [
      {
        id: "style-guide/class-serialization",
        message:
          "Optional field is defining a default value for serialization with `@Ser()`",
        hint: "Make the field required",
        range: [29, 61],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Ser()
export class Foo {
  @Ser(t.number(), { default: () => 1 })
  a;

  #b;
}
    `,
    [],
  );
});

Deno.test("style-guide/component-namespace", () => {
  // Bad
  assertDiagnostics(
    `
@Ser()
export class FooComponent {}
    `,
    [
      {
        id: "style-guide/component-namespace",
        message: "Component class does not implement `ComponentNamespace`",
        hint: undefined,
        range: [21, 33],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Ser()
export class FooComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:foo";
  }
}
    `,
    [],
  );
});
