import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
  Vec3,
} from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class CollisionBoxBlockComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  value: boolean | BoundingBox | BoundingBox[];

  get namespace(): string {
    return "minecraft:collision_box";
  }

  constructor(
    input:
      | boolean
      | DerivedInputProps<typeof BoundingBox>
      | DerivedInputProps<typeof BoundingBox>[],
  ) {
    if (typeof input === "boolean") {
      this.value = input;
    } else if (Array.isArray(input)) {
      this.value = input.map((v) =>
        v instanceof BoundingBox ? v : new BoundingBox(v)
      );
    } else {
      this.value = input instanceof BoundingBox
        ? input
        : new BoundingBox(input);
    }
  }
}

@Ser()
export class BoundingBox {
  @Ser({ default: () => [-8, 0, -8] })
  origin: Vec3;

  @Ser({ default: () => [16, 16, 16] })
  size: Vec3;

  constructor(input: InputProps<BoundingBox, "origin" | "size">) {
    this.origin = input.origin;
    this.size = input.size;
  }
}
