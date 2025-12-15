import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "path" })
export class LootBlockComponent {
  @SerField()
  path: string;

  readonly namespace = "minecraft:loot";

  constructor(path: string) {
    this.path = path;
  }
}
