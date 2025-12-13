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
}
    `,
    [],
  );
});

Deno.test("style-guide/namespace-property-in-component-class", () => {
  // Bad
  assertDiagnostics(
    `
@SerClass()
export class FooComponent {}
    `,
    [
      {
        id: "style-guide/namespace-property-in-component-class",
        message: "Component class does not have a `namespace` static property",
        hint: undefined,
        range: [26, 38],
        fix: [],
      },
    ],
  );

  // Bad
  assertDiagnostics(
    `
@SerClass()
export class FooComponent {
  namespace = "minecraft:foo";
}
    `,
    [
      {
        id: "style-guide/namespace-property-in-component-class",
        message: "Component class `namespace` property is not static",
        hint: undefined,
        range: [43, 71],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@SerClass()
export class FooComponent {
  static namespace = "minecraft:foo";
}
    `,
    [],
  );
});
