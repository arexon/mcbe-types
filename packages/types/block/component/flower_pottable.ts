import { SerClass } from "@mcbe/serialize";

@SerClass()
export class FlowerPottableBlockComponent {
  get namespace(): string {
    return "minecraft:flower_pottable";
  }
}
