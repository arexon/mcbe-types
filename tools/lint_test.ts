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
        message: "The class is not annotated with the `@Serialize` decorator",
        hint:
          "Annotate the class with `@Serialize()` to enable smart serialization",
        range: [14, 17],
        fix: [{ range: [1, 1], text: "@Serialize() " }],
      },
      {
        id: "style-guide/class-serialization",
        message: "The field is not annotated with the `@Serialize` decorator",
        hint:
          "Annotate the field with `@Serialize()` to enable smart serialization",
        range: [22, 28],
        fix: [{ range: [22, 22], text: "@Serialize() " }],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Serialize()
export class Foo {
  @Serialize()
  a = 1;
}
    `,
    [],
  );

  // Bad
  assertDiagnostics(
    `
@Serialize()
export class Foo {
  @Serialize({ default: () => 1 })
  a?;
}
    `,
    [
      {
        id: "style-guide/class-serialization",
        message:
          "Optional field is defining a default value for serialization with `@Serialize`",
        hint: "Make the field required",
        range: [35, 73],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Serialize()
export class Foo {
  @Serialize({ default: () => 1 })
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
@Serialize()
export class FooComponent {}
    `,
    [
      {
        id: "style-guide/component-namespace",
        message: "Component class does not implement `ComponentNamespace`",
        hint: undefined,
        range: [27, 39],
        fix: [],
      },
    ],
  );

  // Good
  assertDiagnostics(
    `
@Serialize()
export class FooComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:foo";
  }
}
    `,
    [],
  );
});
