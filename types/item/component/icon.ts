import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import { unreachable } from "@std/assert";

@Ser({ transparent: "value" })
export class IconItemComponent implements ComponentNamespace {
  @Ser({
    custom: [(v) => {
      if (typeof v === "string") return v;
      return { textures: v };
    }, "normal"],
  })
  value: Identifier | IconTextures;

  get namespace(): string {
    return "minecraft:icon";
  }

  constructor(value: Identifier);
  constructor(props: IconTextures);
  constructor(props: DerivedInputProps<typeof IconTextures>);
  constructor(input: Identifier | IconTextures) {
    if (typeof input === "string") {
      this.value = input;
    } else if (typeof input === "object" && !(input instanceof IconTextures)) {
      this.value = new IconTextures(input);
    } else if (input instanceof IconTextures) {
      this.value = input;
    } else {
      unreachable();
    }
  }
}

@Ser()
export class IconTextures {
  @Ser()
  default: Identifier;

  @Ser()
  dyed?: Identifier;

  @Ser()
  iconTrim?: Identifier;

  @Ser()
  bundleOpenBack?: Identifier;

  @Ser()
  bundleOpenFront?: Identifier;

  constructor(
    props: InputProps<
      IconTextures,
      "default" | "dyed" | "iconTrim" | "bundleOpenBack" | "bundleOpenFront"
    >,
  ) {
    this.default = props.default;
    this.dyed = props.dyed;
    this.iconTrim = props.iconTrim;
    this.bundleOpenBack = props.bundleOpenBack;
    this.bundleOpenFront = props.bundleOpenFront;
  }
}
