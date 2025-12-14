import { SerClass, SerField } from "@mcbe/serialize";
import type { DerivedInputProps, InputProps } from "@mcbe/types/shared";

@SerClass({ transparent: "value" })
export class CollisionBoxBlockComponent {
  @SerField({ default: () => true })
  value: boolean | BoundingBox | BoundingBox[];

  static namespace: string = "minecraft:collision_box";

  constructor(enable: boolean);
  constructor(props: DerivedInputProps<typeof BoundingBox>);
  constructor(props: DerivedInputProps<typeof BoundingBox>[]);
  constructor(
    value:
      | boolean
      | InputProps<BoundingBox, "origin" | "size">
      | InputProps<BoundingBox, "origin" | "size">[],
  ) {
    if (typeof value === "boolean") {
      this.value = value;
    } else if (Array.isArray(value)) {
      this.value = value.map((props) => new BoundingBox(props));
    } else {
      this.value = new BoundingBox(value);
    }
  }
}

// TODO: Look into whether these are required or not.
@SerClass()
export class BoundingBox {
  @SerField({ default: () => [-8, 0, -8] })
  origin: [number, number, number];

  @SerField({ default: () => [16, 16, 16] })
  size: [number, number, number];

  constructor(props: InputProps<BoundingBox, "origin" | "size">) {
    this.origin = props.origin;
    this.size = props.size;
  }
}
