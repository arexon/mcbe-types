const IGNORED_PATHS = [
  "packages/serialize",
  "packages/validate",
];

export default {
  name: "style-guide",
  rules: {
    "class-serialization": {
      create(ctx) {
        if (IGNORED_PATHS.some((p) => ctx.filename.includes(p))) return {};

        const SER = "Serialize";

        return {
          ClassDeclaration(_node) {
            // FIXME(@arexon): This is temporary until Deno adds typings for decorators in `ClassDeclaration`.
            const node = _node as Deno.lint.ClassDeclaration & {
              decorators: Deno.lint.Decorator[];
            };

            if (node.id === null || node.abstract) return;

            if (
              !node.decorators.some((decoNode) =>
                decoNode.expression.type === "CallExpression" &&
                decoNode.expression.callee.type === "Identifier" &&
                decoNode.expression.callee.name === SER
              )
            ) {
              ctx.report({
                node: node.id,
                message:
                  `The class is not annotated with the \`@${SER}\` decorator`,
                hint:
                  `Annotate the class with \`@${SER}()\` to enable smart serialization`,
                fix(fixer) {
                  return fixer.insertTextBeforeRange(
                    node.parent.range,
                    `@${SER}() `,
                  );
                },
              });
            }

            for (const propNode of node.body.body) {
              if (
                propNode.type !== "PropertyDefinition" ||
                propNode.key.type === "PrivateIdentifier" ||
                propNode.static
              ) {
                continue;
              }

              const fieldDecoNode = propNode.decorators.find((decoNode) =>
                decoNode.expression.type === "CallExpression" &&
                decoNode.expression.callee.type === "Identifier" &&
                decoNode.expression.callee.name === SER
              );

              if (fieldDecoNode === undefined) {
                ctx.report({
                  node: propNode,
                  message:
                    `The field is not annotated with the \`@${SER}\` decorator`,
                  hint:
                    `Annotate the field with \`@${SER}()\` to enable smart serialization`,
                  fix(fixer) {
                    return fixer.insertTextBeforeRange(
                      propNode.range,
                      `@${SER}() `,
                    );
                  },
                });
              } else if (
                fieldDecoNode.expression.type === "CallExpression" &&
                fieldDecoNode.expression.arguments.length === 1 &&
                propNode.optional
              ) {
                const optsNode = fieldDecoNode.expression.arguments[0];
                if (
                  optsNode !== undefined &&
                  optsNode.type === "ObjectExpression" &&
                  optsNode.properties.some((propNode) =>
                    propNode.type === "Property" &&
                    propNode.key.type === "Identifier" &&
                    propNode.key.name === "default"
                  )
                ) {
                  ctx.report({
                    node: propNode,
                    message:
                      `Optional field is defining a default value for serialization with \`@${SER}\``,
                    hint: "Make the field required",
                  });
                }
              }
            }
          },
        };
      },
    },
    "component-namespace": {
      create(ctx) {
        const COMP_NAMESPACE = "ComponentNamespace";
        return {
          ClassDeclaration(node) {
            if (IGNORED_PATHS.some((p) => ctx.filename.includes(p))) return {};

            if (
              node.id !== null &&
              (
                node.id.name.endsWith("Component") ||
                node.id.name.endsWith("Trait")
              ) &&
              !node.implements.some((impl) =>
                impl.expression.type === "Identifier" &&
                impl.expression.name === COMP_NAMESPACE
              )
            ) {
              return ctx.report({
                node: node.id,
                message:
                  `Component class does not implement \`${COMP_NAMESPACE}\``,
              });
            }
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
