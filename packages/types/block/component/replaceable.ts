import { SerClass } from "@mcbe/serialize";

@SerClass()
export class ReplaceableBlockComponent {
  get namespace(): string {
    return "minecraft:replaceable";
  }
}
