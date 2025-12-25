import { Serialize } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Serialize()
export class FlammableBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => true })
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

@Serialize()
export class Flammable {
  @Serialize({ default: () => 5 })
  catchChanceModifier: number;

  @Serialize({ default: () => 20 })
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
