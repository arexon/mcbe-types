import { SerClass, SerField } from "@mcbe/serialize";
import type { LocalizationText } from "@mcbe/types/text";

@SerClass({ transparent: "value" })
export class DisplayNameBlockComponent {
  @SerField()
  value: LocalizationText;

  static namespace: string = "minecraft:display_name";

  constructor(value: LocalizationText) {
    this.value = value;
  }
}
