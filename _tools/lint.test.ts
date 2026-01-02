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

Deno.test("style-guide/class-(de)serialization", () => {
  // Bad
  assertDiagnostics(
    `
export class Foo {
  a = 1;
}
    `,
    [
      {
        id: "style-guide/class-(de)serialization",
        message: "The class is not annotated with the `@Edres` decorator",
        hint:
          "Annotate the class with `@Edres()` to enable smart serialization",
        range: [14, 17],
        fix: [{ range: [1, 1], text: "@Edres() " }],
      },
      {
        id: "style-guide/class-(de)serialization",
        message: "The field is not annotated with the `@Edres` decorator",
        hint:
          "Annotate the field with `@Edres()` to enable smart serialization",
        range: [22, 28],
        fix: [{ range: [22, 22], text: "@Edres() " }],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Edres()
export class Foo {
  @Edres()
  a = 1;
}
    `,
    [],
  );

  // Bad
  assertDiagnostics(
    `
@Edres()
export class Foo {
  @Edres(t.number(), { default: () => 1 })
  a?;
}
    `,
    [
      {
        id: "style-guide/class-(de)serialization",
        message:
          "Optional field is defining a default value for serialization with `@Edres()`",
        hint: "Make the field required",
        range: [31, 77],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Edres()
export class Foo {
  @Edres(t.number(), { default: () => 1 })
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
@Edres()
export class FooComponent {}
    `,
    [
      {
        id: "style-guide/component-namespace",
        message: "Component class does not implement `ComponentNamespace`",
        hint: undefined,
        range: [23, 35],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Edres()
export class FooComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:foo";
  }
}
    `,
    [],
  );
});
