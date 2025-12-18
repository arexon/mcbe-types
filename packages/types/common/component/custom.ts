import { SerClass, SerField } from "@mcbe/serialize";

/**
 * Common custom component for blocks and items.
 *
 * @example Usage with custom schema
 * ```ts
 * interface PaintableCustomComponent {
 *   namespace: "custom:paintable";
 *   params: { colors: string[] };
 * }
 *
 * new CustomComponent<PaintableCustomComponent>("custom:paintable", {
 *   colors: ["red", "blue"],
 * });
 * ```
 */
@SerClass({ transparent: "params" })
export class CustomComponent<
  // deno-lint-ignore no-explicit-any
  Schema extends { namespace: string; params: unknown } = any,
  Namespace extends string = Schema["namespace"],
> {
  @SerField()
  params: unknown;

  #namespace: string;

  get namespace(): string {
    return this.#namespace;
  }

  constructor(namespace: Namespace, params: Schema["params"]) {
    this.params = params;
    this.#namespace = namespace;
  }
}
