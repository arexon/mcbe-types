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
    props: InputProps<CooldownItemComponent, "category" | "duration", "type">,
  ) {
    this.category = props.category;
    this.duration = props.duration;
    this.type = props.type ?? "use";
  }
}
