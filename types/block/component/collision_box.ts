import { Edres } from "@mcbe/edres";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Edres({ transparent: "value" })
export class CollisionBoxBlockComponent implements ComponentNamespace {
  @Edres({ default: () => true })
  value: boolean | BoundingBox | BoundingBox[];

  get namespace(): string {
    return "minecraft:collision_box";
  }

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

@Edres()
export class BoundingBox {
  @Edres({ default: () => [-8, 0, -8] })
  origin: [number, number, number];

  @Edres({ default: () => [16, 16, 16] })
  size: [number, number, number];

  constructor(props: InputProps<BoundingBox, "origin" | "size">) {
    this.origin = props.origin;
    this.size = props.size;
  }
}
