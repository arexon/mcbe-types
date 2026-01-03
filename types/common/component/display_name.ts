import { Edres } from "@mcbe/edres";
import type { LocalizationText } from "@mcbe/types/text";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres({ transparent: "value" })
export class DisplayNameComponent implements ComponentNamespace {
  @Edres()
  value: LocalizationText;

  get namespace(): string {
    return "minecraft:display_name";
  }

  constructor(value: LocalizationText) {
    this.value = value;
  }
}
