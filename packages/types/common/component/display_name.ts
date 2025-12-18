import { SerClass, SerField } from "@mcbe/serialize";
import type { LocalizationText } from "@mcbe/types/text";

@SerClass({ transparent: "value" })
export class DisplayNameComponent {
  @SerField()
  value: LocalizationText;

  get namespace(): string {
    return "minecraft:display_name";
  }

  constructor(value: LocalizationText) {
    this.value = value;
  }
}
