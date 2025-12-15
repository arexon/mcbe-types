export default {
  name: "style-guide",
  rules: {
    "class-serialization": {
      create(ctx) {
        const SER_CLASS_ID = "SerClass";
        const SER_FIELD_ID = "SerField";

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
                decoNode.expression.callee.name === SER_CLASS_ID
              )
            ) {
              ctx.report({
                node: node.id,
                message:
                  `The class is not annotated with the \`@${SER_CLASS_ID}\` decorator`,
                hint:
                  `Annotate the class with \`@${SER_CLASS_ID}()\` to enable smart serialization`,
                fix(fixer) {
                  return fixer.insertTextBeforeRange(
                    node.parent.range,
                    `@${SER_CLASS_ID}() `,
                  );
                },
              });
            }

            for (const propNode of node.body.body) {
              if (
                propNode.type !== "PropertyDefinition" ||
                propNode.key.type === "PrivateIdentifier" ||
                propNode.static ||
                // We don't wanna interfere with `namespace-property-in-component-class`.
                // This *could* cause problems in the future if we ever end up
                // needing a property named "namespace" inside a component class.
                (
                  propNode.key.type === "Identifier" &&
                  propNode.key.name === "namespace"
                )
              ) {
                continue;
              }

              const fieldDecoNode = propNode.decorators.find((decoNode) =>
                decoNode.expression.type === "CallExpression" &&
                decoNode.expression.callee.type === "Identifier" &&
                decoNode.expression.callee.name === SER_FIELD_ID
              );

              if (fieldDecoNode === undefined) {
                ctx.report({
                  node: propNode,
                  message:
                    `The field is not annotated with the \`@${SER_FIELD_ID}\` decorator`,
                  hint:
                    `Annotate the field with \`@${SER_FIELD_ID}()\` to enable smart serialization`,
                  fix(fixer) {
                    return fixer.insertTextBeforeRange(
                      propNode.range,
                      `@${SER_FIELD_ID}() `,
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
                      `Optional field is defining a default value for serialization with \`@${SER_FIELD_ID}\``,
                    hint: "Make the field required",
                  });
                }
              }
            }
          },
        };
      },
    },
    "namespace-property-in-component-class": {
      create(ctx) {
        return {
          ClassDeclaration(node) {
            if (
              node.id === null ||
              node.abstract ||
              (
                !node.id.name.endsWith("Component") &&
                !node.id.name.endsWith("Trait")
              )
            ) return;

            const namespaceProp = node.body.body.find((
              propNode,
            ): propNode is Deno.lint.PropertyDefinition =>
              propNode.type === "PropertyDefinition" &&
              propNode.key.type === "Identifier" &&
              propNode.key.name === "namespace"
            );

            if (namespaceProp === undefined) {
              return ctx.report({
                node: node.id,
                message:
                  "Component class does not have a readonly `namespace` property",
              });
            }

            if (!namespaceProp.readonly) {
              ctx.report({
                node: namespaceProp,
                message: "Component class `namespace` property is not readonly",
              });
            }
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
