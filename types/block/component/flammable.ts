import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Ser()
export class FlammableBlockComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  value: boolean | Flammable;

  get namespace(): string {
    return "minecraft:flammable";
  }

  constructor(input: boolean | DerivedInputProps<typeof Flammable>) {
    if (typeof input === "boolean") {
      this.value = input;
    } else {
      this.value = input instanceof Flammable ? input : new Flammable(input);
    }
  }
}

@Ser()
export class Flammable {
  @Ser({ default: () => 5 })
  catchChanceModifier: number;

  @Ser({ default: () => 20 })
  destroyChanceModifier: number;

  constructor(
    input: InputProps<
      Flammable,
      "catchChanceModifier" | "destroyChanceModifier"
    >,
  ) {
    this.catchChanceModifier = input.catchChanceModifier;
    this.destroyChanceModifier = input.destroyChanceModifier;
  }
}
