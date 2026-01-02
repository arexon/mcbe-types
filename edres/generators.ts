import type { AnyConstructor, equal } from "@std/assert";
import {
  FIELDS_METADATA_VAR_NAME,
  type FieldsMetadata,
  getMetadataFrom,
} from "./metadata.ts";
import type { EdresError } from "./mod.ts";
import type { EdresType } from "./types.ts";

type ToJsonFn<T extends AnyConstructor> = (
  this: InstanceType<T>,
  /** Should match {@link FIELDS_METADATA_VAR_NAME}. */
  fieldsMetadata: symbol,
  equalFn?: typeof equal,
) => Record<string, unknown>;

export class ToJsonGenerator<T extends AnyConstructor> {
  #js = new JsGenerator();
  #fields: FieldsMetadata;
  #transparent?: string;

  constructor(fields: FieldsMetadata, transparent?: string) {
    this.#fields = fields;
    this.#transparent = transparent;
  }

  generate(): ToJsonFn<T> {
    const canClassBeTransparent: string[] = [];

    const finalProps: string[] = [];
    const customValues: [string, string][] = [];

    if (this.#fields.length > 0) {
      const res = "result";
      for (const field of this.#fields) {
        const key = this.#fields.getKey(field.name);
        let value = `this["${field.name}"]`;

        const canFieldAllowTransprency = [];
        if (field.name !== this.#transparent) {
          canFieldAllowTransprency.push(`${value} === undefined`);
        }

        if (field.custom !== undefined) {
          const customValue = `customValue${field.index}`;

          // Cache custom override functions.
          customValues.push([
            customValue,
            getMetadataFrom(
              "this",
              field.name,
              `custom.fn(${value})`,
            ),
          ]);

          value = customValue;
        }

        if (field.default !== undefined) {
          const isDefault = `equalFn(${
            JSON.stringify(field.default())
          }, ${value})`;

          if (
            this.#transparent !== undefined &&
            field.name !== this.#transparent
          ) {
            canFieldAllowTransprency.push(isDefault);
          }

          value = `${isDefault} ? undefined : ${value}`;
        }

        if (field.custom?.strategy === "merge") {
          finalProps.push(`...(${value}),`);
        } else {
          finalProps.push(`"${key}": ${value},`);
        }

        if (
          this.#transparent !== undefined && field.name !== this.#transparent
        ) {
          canClassBeTransparent.push(
            `(${canFieldAllowTransprency.join(" || ")})`,
          );
        }
      }

      const appendProps = () => {
        this.#js.scope(() => {
          for (const prop of finalProps) {
            this.#js.append(prop);
          }
        });
      };
      for (const [name, value] of customValues) {
        this.#js.const(name, value);
      }

      if (canClassBeTransparent.length > 0) {
        this.#js.const(res, appendProps);
      } else if (this.#transparent === undefined) {
        // In case of no transparency needed, we can collapse to a return with an object.
        this.#js.return(appendProps);
      }

      if (this.#transparent !== undefined) {
        const transparentField = this.#fields.get(this.#transparent)!;
        let value: string;
        if (transparentField.custom !== undefined) {
          value = `customValue${transparentField.index}`;
        } else {
          value = `this["${transparentField.name}"]`;
        }

        if (
          transparentField.type.kind === "custom" ||
          (transparentField.type.kind === "optional" &&
            transparentField.type.value.kind === "custom")
        ) {
          // This is necessary because `toJSON()` is not called on directly returned values.
          // TODO: Maybe throw an error if the method does not exist.
          value = `${value}?.toJSON?.()`;
        }

        if (canClassBeTransparent.length > 0) {
          this.#js.if(
            canClassBeTransparent.join(" && "),
            () => this.#js.return(value),
          );
        } else {
          this.#js.return(value);
        }
      }

      if (canClassBeTransparent.length > 0) {
        this.#js.return(res);
      }
    } else if (this.#transparent !== undefined) {
      this.#js.return(`this["${this.#transparent}"]`);
    } else {
      this.#js.return("{}");
    }

    return new Function(
      FIELDS_METADATA_VAR_NAME,
      "equalFn",
      this.#js.body,
    ) as ToJsonFn<T>;
  }
}

type FromJsonFn<T extends AnyConstructor> = (
  input: unknown,
  ctor: T,
  /** Should match {@link FIELDS_METADATA_VAR_NAME}. */
  fieldsMetadata: symbol,
  parentPath?: string,
) => InstanceType<T> | EdresError;

export class FromJsonGenerator<T extends AnyConstructor> {
  #js = new JsGenerator();
  #fields: FieldsMetadata;
  #ctor: T;
  #idIndex = -1;
  #parentTypeKind?: CompoundTypeInfo["kind"];

  constructor(fields: FieldsMetadata, ctor: T) {
    this.#fields = fields;
    this.#ctor = ctor;
  }

  get #uniqueId(): number {
    this.#idIndex += 1;
    return this.#idIndex;
  }

  get #isRequired(): boolean {
    return this.#parentTypeKind !== "optional" &&
      this.#parentTypeKind !== "union" &&
      this.#parentTypeKind !== "tuple";
  }

  generate(): FromJsonFn<T> {
    this.#js.const("output", "Object.create(ctor.prototype)");
    this.#js.const("errors", "[]");

    this.#js.const(
      "pathPrefix",
      'typeof parentPath === "string" ? parentPath + "." : ""',
    );

    this.#js.if('typeof input !== "object"', () => {
      this.#generateError([this.#ctor.name], "Expected an object");
      this.#js.return(`{ isOk: false, errors }`);
    });

    if (this.#fields.length > 0) {
      for (const field of this.#fields) {
        const key = this.#fields.getKey(field.name);
        const input = `fieldInput${this.#uniqueId}`;
        const output = `output["${field.name}"]`;
        const path = [this.#ctor.name, field.name];

        this.#js.const(input, `input?.["${key}"]`);

        this.#generateType(
          field.name,
          field.type,
          new TypeNesting(),
          input,
          output,
          path,
        );
      }

      this.#js.if(
        `errors.length > 0`,
        () => this.#js.return(`{ isOk: false, errors }`),
      );
      this.#js.else(() => this.#js.return(`{ isOk: true, value: output }`));
    } else {
      this.#js.return(`{ isOk: true, value: {} }`);
    }

    return new Function(
      "input",
      "ctor",
      FIELDS_METADATA_VAR_NAME,
      "parentPath",
      this.#js.body,
    ) as FromJsonFn<T>;
  }

  #generateType(
    fieldName: string,
    fieldType: EdresType,
    typeNesting: TypeNesting,
    input: string,
    output: string,
    path: string[],
  ): void {
    const prevParentTypeKind = this.#parentTypeKind;
    this.#parentTypeKind = typeNesting.parentTypeKind();

    switch (fieldType.kind) {
      case "optional": {
        this.#js.scope(() => {
          this.#js.if(`${input} === undefined`, () => {
            this.#js.assign(output, "undefined");
            if (this.#parentTypeKind === "union") this.#js.break("union");
            else this.#js.break("optional");
          });

          this.#generateType(
            fieldName,
            fieldType.value,
            typeNesting.extendWith({ kind: "optional" }),
            input,
            output,
            path,
          );
        }, "optional");
        break;
      }
      case "boolean": {
        this.#js.if(
          `typeof ${input} === "boolean"`,
          () => {
            this.#js.assign(output, input);
            if (this.#parentTypeKind === "union") this.#js.break("union");
          },
        );

        this.#generateErrorHandling(input, path, "Expected a boolean");
        break;
      }
      case "string": {
        this.#js.if(
          `typeof ${input} === "string"`,
          () => {
            this.#js.assign(output, input);
            if (this.#parentTypeKind === "union") this.#js.break("union");
          },
        );

        this.#generateErrorHandling(input, path, "Expected a string");
        break;
      }
      case "number": {
        this.#js.if(`typeof ${input} === "number"`, () => {
          if (fieldType.minimum !== undefined) {
            this.#js.if(
              `${input} > ${fieldType.minimum}`,
              () =>
                this.#generateError(
                  path,
                  `Not greater than ${fieldType.minimum}`,
                ),
              true,
            );
          } else if (fieldType.exclusiveMinimum !== undefined) {
            this.#js.if(
              `${input} >= ${fieldType.exclusiveMinimum}`,
              () =>
                this.#generateError(
                  path,
                  `Not greater than or equal to ${fieldType.exclusiveMinimum}`,
                ),
              true,
            );
          }

          if (fieldType.maximum !== undefined) {
            this.#js.if(
              `${input} < ${fieldType.maximum}`,
              () =>
                this.#generateError(
                  path,
                  `Not less than ${fieldType.maximum}`,
                ),
              true,
            );
          } else if (fieldType.exclusiveMaximum !== undefined) {
            this.#js.if(
              `${input} <= ${fieldType.exclusiveMaximum}`,
              () =>
                this.#generateError(
                  path,
                  `Not less than or equal to ${fieldType.exclusiveMaximum}`,
                ),
              true,
            );
          }

          this.#js.assign(output, input);
          if (this.#parentTypeKind === "union") this.#js.break("union");
        });

        this.#generateErrorHandling(input, path, "Expected a number");
        break;
      }
      case "literal": {
        this.#js.if(
          `${input} === "${fieldType.value}"`,
          () => {
            this.#js.assign(output, input);
            if (this.#parentTypeKind === "union") this.#js.break("union");
          },
        );

        this.#generateErrorHandling(
          input,
          path,
          `Expected a literal of \\"${fieldType.value}\\"`,
        );
        break;
      }
      case "object": {
        if (this.#isRequired) {
          this.#js.if(`${input} === undefined`, () => {
            this.#generateRequiredFieldError(path);
          });
        }
        this.#js[this.#isRequired ? "elseIf" : "if"](
          `typeof ${input} === "object"`,
          () => {
            const obj = `object${this.#uniqueId}`;
            this.#js.const(obj, "{}");
            for (const [key, value] of Object.entries(fieldType.fields)) {
              this.#generateType(
                fieldName,
                value,
                typeNesting.extendWith({ kind: "object", key }),
                `${input}["${key}"]`,
                `${obj}["${key}"]`,
                [...path, key],
              );
            }
            this.#js.assign(output, obj);
          },
        );
        this.#js.else(() => {
          this.#generateError(path, "Expected an object");
        });
        break;
      }
      case "array": {
        this.#js.if(`Array.isArray(${input})`, () => {
          const res = `arrayResult${this.#uniqueId}`;
          const arr = `array${this.#uniqueId}`;
          const item = `arrayItem${this.#uniqueId}`;

          this.#js.const(arr, "[]");

          this.#js.forLoop(item, input, () => {
            this.#js.let(res);
            this.#generateType(
              fieldName,
              fieldType.element,
              typeNesting.extendWith({ kind: "array" }),
              item,
              res,
              [...path, "#${i}"],
            );
            this.#js.push(arr, res);
          });

          this.#js.assign(output, arr);
          if (this.#parentTypeKind === "union") this.#js.break("union");
        });

        this.#generateErrorHandling(input, path, "Expected an array");
        break;
      }
      case "union": {
        if (this.#isRequired) {
          this.#js.if(`${input} === undefined`, () => {
            this.#generateRequiredFieldError(path);
          });
        }

        const fn = () => {
          this.#js.scope(() => {
            for (const [index, opt] of fieldType.options.entries()) {
              this.#generateType(
                fieldName,
                opt,
                typeNesting.extendWith({ kind: "union", optionIndex: index }),
                input,
                output,
                path,
              );
            }
          }, "union");

          this.#js.if(`${output} === undefined`, () => {
            let message = "Expected a ";
            for (let i = 0; i < fieldType.options.length; i++) {
              const optionType = fieldType.options[i];
              if (optionType.kind === "custom") {
                message += optionType.inner.name;
              } else if (optionType.kind === "literal") {
                message += `literal of \\"${optionType.value}\\"`;
              } else {
                message += optionType.kind;
              }
              if (i === fieldType.options.length - 2) message += ", or ";
              else if (i < fieldType.options.length - 1) message += ", ";
            }
            this.#generateError(path, message);
          });
        };
        if (this.#isRequired) this.#js.else(fn);
        else fn();
        break;
      }
      case "tuple": {
        const arr = `tupleArray${this.#uniqueId}`;

        this.#js.if(`Array.isArray(${input})`, () => {
          this.#js.const(arr, `new Array(${fieldType.items.length})`);
          for (const [index, item] of fieldType.items.entries()) {
            const res = `${arr}[${index}]`;
            this.#generateType(
              fieldName,
              item,
              typeNesting.extendWith({ kind: "tuple", itemIndex: index }),
              input + `[${index}]`,
              res,
              [...path, `#${index}`],
            );
          }
          this.#js.assign(output, arr);
          if (this.#parentTypeKind === "union") this.#js.break("union");
        });

        this.#generateErrorHandling(input, path, "Expected a tuple array");
        break;
      }
      case "custom": {
        const res = `customResult${this.#uniqueId}`;
        const ctor = `ctor${this.#uniqueId}`;

        this.#js.hoist(() => {
          const data = ["type", ...typeNesting.format(), `inner`].join(".");
          this.#js.const(ctor, getMetadataFrom("ctor", fieldName, data));
        });

        if (this.#isRequired) {
          this.#js.if(`${input} === undefined`, () => {
            this.#generateRequiredFieldError(path);
          });
        }

        const fn = () => {
          this.#js.const(
            res,
            `${ctor}.fromJSON(${input}, ${ctor}, ${formatPath(path)})`,
          );

          this.#js.if(`${res}.isOk === true`, () => {
            this.#js.assign(output, `${res}.value`);
            if (this.#parentTypeKind === "union") this.#js.break("union");
          });

          if (this.#parentTypeKind !== "union") {
            this.#js.if(`${res}.isOk === false`, () => {
              this.#js.push("errors", `...${res}.errors`);
            });
          }
        };
        if (this.#isRequired) this.#js.else(fn);
        else fn();

        break;
      }
    }

    this.#parentTypeKind = prevParentTypeKind;
  }

  #generateErrorHandling(
    input: string,
    path: string[],
    message?: string,
  ): void {
    if (this.#isRequired) {
      this.#js.elseIf(
        `${input} === undefined`,
        () => this.#generateRequiredFieldError(path),
      );
    }
    if (this.#parentTypeKind !== "union" && message !== undefined) {
      this.#js.else(() => this.#generateError(path, message));
    }
  }

  #generateRequiredFieldError(path: string[]): void {
    this.#js.push(
      "errors",
      `{ path: ${formatPath(path)}, message: "Required field is missing" }`,
    );
  }

  #generateError(path: string[], message: string): void {
    this.#js.push(
      "errors",
      `{ path: ${formatPath(path)}, message: "${message}" }`,
    );
  }
}

/**
 * Used to keep track of the type nesting level specifically for indexing into a
 * custom constructor stored in {@link FieldsMetadata}.
 */
class TypeNesting {
  #list: CompoundTypeInfo[] = [];

  /** Creates a new derived instance with the given {@link CompoundTypeInfo}. */
  extendWith(typeInfo: CompoundTypeInfo): TypeNesting {
    const v = new TypeNesting();
    v.#list = [...this.#list, typeInfo];
    return v;
  }

  /** Returns the last kind in the nesting (parent). */
  parentTypeKind(): CompoundTypeInfo["kind"] | undefined {
    const kind = this.#list[this.#list.length - 1]?.kind;
    // Skipping optional is intended because it is treated as transparent.
    // if (kind === "optional") return this.list[this.list.length - 2]?.kind;
    return kind;
  }

  /** Returns a formatted index access. */
  format(): string[] {
    return this.#list.map((typeNesting) => {
      switch (typeNesting.kind) {
        case "object":
          return `type["${typeNesting.key}"]`;
        case "array":
          return "element";
        case "tuple":
          return `items[${typeNesting.itemIndex}]`;
        case "union":
          return `options[${typeNesting.optionIndex}]`;
        case "optional":
          return "value";
      }
    });
  }
}

/** Basic info about a nested type in {@link TypeNesting}. */
type CompoundTypeInfo = {
  kind: "object";
  key: string;
} | {
  kind: "array";
} | {
  kind: "tuple";
  itemIndex: number;
} | {
  kind: "union";
  optionIndex: number;
} | {
  kind: "optional";
};

function formatPath(path: string[]): string {
  let res = "pathPrefix + `";
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    if (!part.startsWith("#") && i !== 0) res += ".";
    res += part;
  }
  res += "`";
  return res;
}

class JsGenerator {
  #buffer = "";
  #hoistedBuffer = "";
  #useHoisted = false;

  get body(): string {
    return this.#hoistedBuffer + this.#buffer;
  }

  hoist(fn: () => void): void {
    this.#useHoisted = true;
    fn();
    this.#useHoisted = false;
  }

  append(input: string): void {
    if (this.#useHoisted) this.#hoistedBuffer += input;
    else this.#buffer += input;
  }

  if(condition: string, fn: () => void, invert: boolean = false): void {
    if (invert) this.append(`if (!(${condition}))`);
    else this.append(`if (${condition})`);
    this.scope(fn);
  }

  elseIf(condition: string, fn: () => void, invert: boolean = false): void {
    if (invert) this.append(`else if (!(${condition}))`);
    else this.append(`else if (${condition})`);
    this.scope(fn);
  }

  else(fn: () => void): void {
    this.append("else");
    this.scope(fn);
  }

  forLoop(element: string, target: string, fn: () => void): void {
    this.append(`for (let i = 0; i < ${target}.length; i++)`);
    this.scope(() => {
      this.const(element, `${target}[i]`);
      fn();
    });
  }

  let(left: string, right?: string): void;
  let(left: string, right?: () => void): void;
  let(left: string, right?: string | (() => void)): void {
    this.append("let ");
    if (typeof right === "string") this.assign(left, right);
    else if (typeof right === "function") this.assign(left, right);
    else this.append(`${left};`);
  }

  const(left: string, right: string): void;
  const(left: string, right: () => void): void;
  const(left: string, right: string | (() => void)): void {
    this.append("const ");
    if (typeof right === "string") this.assign(left, right);
    else this.assign(left, right);
  }

  assign(left: string, right: string): void;
  assign(left: string, right: () => void): void;
  assign(left: string, right: string | (() => void)): void {
    this.append(`${left} = `);
    if (typeof right === "string") this.append(`${right};`);
    else {
      right();
      this.append(";");
    }
  }

  return(expr: string): void;
  return(expr: () => void): void;
  return(expr: string | (() => void)): void {
    this.append("return ");
    if (typeof expr === "string") this.append(expr);
    else expr();
    this.append(";");
  }

  break(label?: string): void {
    if (label === undefined) this.append("break;");
    else this.append(`break ${label};`);
  }

  push(target: string, element: string): void {
    this.append(`${target}.push(${element});`);
  }

  scope(fn: () => void, label?: string): void {
    if (label !== undefined) this.append(`${label}:`);
    this.append("{");
    fn();
    this.append("}");
  }
}
