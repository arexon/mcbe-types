import { SerClass, SerField } from "@mcbe/serialize";
import type { DerivedInputProps, InputProps } from "@mcbe/types/common";

@SerClass()
export class FlammableBlockComponent {
  @SerField({ default: () => true })
  value: boolean | Flammable;

  readonly namespace = "minecraft:flammable";

  constructor(value: boolean);
  constructor(props: DerivedInputProps<typeof Flammable>);
  constructor(value: boolean | DerivedInputProps<typeof Flammable>) {
    if (typeof value === "boolean") this.value = value;
    else this.value = new Flammable(value);
  }
}

@SerClass()
export class Flammable {
  @SerField({ default: () => 5 })
  catchChanceModifier: number;

  @SerField({ default: () => 20 })
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
