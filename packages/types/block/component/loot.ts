import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "path" })
export class LootBlockComponent {
  @SerField()
  path: string;

  get namespace(): string {
    return "minecraft:loot";
  }

  constructor(path: string) {
    this.path = path;
  }
}
