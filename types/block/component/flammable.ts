import { Edres } from "@mcbe/edres";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Edres()
export class FlammableBlockComponent implements ComponentNamespace {
  @Edres({ default: () => true })
  value: boolean | Flammable;

  get namespace(): string {
    return "minecraft:flammable";
  }

  constructor(value: boolean);
  constructor(props: DerivedInputProps<typeof Flammable>);
  constructor(value: boolean | DerivedInputProps<typeof Flammable>) {
    if (typeof value === "boolean") this.value = value;
    else this.value = new Flammable(value);
  }
}

@Edres()
export class Flammable {
  @Edres({ default: () => 5 })
  catchChanceModifier: number;

  @Edres({ default: () => 20 })
  destroyChanceModifier: number;

  constructor(
    props: InputProps<
      Flammable,
      "catchChanceModifier" | "destroyChanceModifier"
    >,
  ) {
    this.catchChanceModifier = props.catchChanceModifier;
    this.destroyChanceModifier = props.destroyChanceModifier;
  }
}
