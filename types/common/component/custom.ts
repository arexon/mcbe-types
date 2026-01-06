import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

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
@Ser({ transparent: "params" })
export class CustomComponent<
  Schema extends {
    namespace: string;
    params: unknown;
  } = {
    namespace: string;
    params: unknown;
  },
  Namespace extends string = Schema["namespace"],
> implements ComponentNamespace {
  @Ser()
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
