import { Ser } from "@mcbe/serialize";
import type { LocalizationText } from "@mcbe/types/text";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class DisplayNameComponent implements ComponentNamespace {
  @Ser()
  value: LocalizationText;

  get namespace(): string {
    return "minecraft:display_name";
  }

  constructor(input: LocalizationText) {
    this.value = input;
  }
}
