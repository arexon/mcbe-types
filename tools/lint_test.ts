import { assertEquals } from "@std/assert";
import plugin from "./lint.ts";

function assertDiagnostics(
  source: string,
  expectedDiagnostics: Deno.lint.Diagnostic[],
) {
  const actualDiagnostics = Deno.lint.runPlugin(plugin, "mod.ts", source);
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
        message: "The class is not annotated with the `@SerClass` decorator",
        hint:
          "Annotate the class with `@SerClass()` to enable smart serialization",
        range: [14, 17],
        fix: [{ range: [1, 1], text: "@SerClass() " }],
      },
      {
        id: "style-guide/class-serialization",
        message: "The field is not annotated with the `@SerField` decorator",
        hint:
          "Annotate the field with `@SerField()` to enable smart serialization",
        range: [22, 28],
        fix: [{ range: [22, 22], text: "@SerField() " }],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@SerClass()
export class Foo {
  @SerField()
  a = 1;
}
    `,
    [],
  );

  // Bad
  assertDiagnostics(
    `
@SerClass()
export class Foo {
  @SerField({ default: (value) => value === 1 })
  a?;
}
    `,
    [
      {
        id: "style-guide/class-serialization",
        message:
          "Optional field is defining a default value for serialization with `@SerField`",
        hint: "Make the field required",
        range: [34, 86],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@SerClass()
export class Foo {
  @SerField({ default: (value) => value === 1 })
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
@SerClass()
export class FooComponent {}
    `,
    [
      {
        id: "style-guide/component-namespace",
        message: "Component class does not implement `ComponentNamespace`",
        hint: undefined,
        range: [26, 38],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@SerClass()
export class FooComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:foo";
  }
}
    `,
    [],
  );
});
