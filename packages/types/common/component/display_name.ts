import { Serialize } from "@mcbe/serialize";
import type { LocalizationText } from "@mcbe/types/text";
import type { ComponentNamespace } from "@mcbe/types/common";

@Serialize({ transparent: "value" })
export class DisplayNameComponent implements ComponentNamespace {
  @Serialize()
  value: LocalizationText;

  get namespace(): string {
    return "minecraft:display_name";
  }

  constructor(value: LocalizationText) {
    this.value = value;
  }
}
