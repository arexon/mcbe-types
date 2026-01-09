import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class IconItemComponent implements ComponentNamespace {
  @Ser({
    custom: [(v) => {
      if (typeof v === "string") return v;
      return { textures: v };
    }, "normal"],
  })
  value: string | IconTextures;

  get namespace(): string {
    return "minecraft:icon";
  }

  constructor(input: string | DerivedInputProps<typeof IconTextures>) {
    if (typeof input === "string") {
      this.value = input;
    } else {
      this.value = input instanceof IconTextures
        ? input
        : new IconTextures(input);
    }
  }
}

@Ser()
export class IconTextures {
  @Ser()
  default: string;

  @Ser()
  dyed?: string;

  @Ser()
  iconTrim?: string;

  @Ser()
  bundleOpenBack?: string;

  @Ser()
  bundleOpenFront?: string;

  constructor(
    input: InputProps<
      IconTextures,
      "default" | "dyed" | "iconTrim" | "bundleOpenBack" | "bundleOpenFront"
    >,
  ) {
    this.default = input.default;
    this.dyed = input.dyed;
    this.iconTrim = input.iconTrim;
    this.bundleOpenBack = input.bundleOpenBack;
    this.bundleOpenFront = input.bundleOpenFront;
  }
}
