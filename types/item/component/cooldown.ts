import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class CooldownItemComponent implements ComponentNamespace {
  @Ser()
  category: string;

  @Ser()
  duration: number;

  @Ser({ default: () => "use" })
  type: "use" | "attack";

  get namespace(): string {
    return "minecraft:cooldown";
  }

  constructor(
    input: InputProps<CooldownItemComponent, "category" | "duration", "type">,
  ) {
    this.category = input.category;
    this.duration = input.duration;
    this.type = input.type ?? "use";
  }
}
