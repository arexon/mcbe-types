import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "version" })
export class FormatVersion {
  @SerField({
    custom: (v) => ({ value: `${v[0]}.${v[1]}.${v[2]}`, strategy: "normal" }),
  })
  version: [number, number, number];

  constructor(version: [number, number, number]) {
    this.version = version;
  }
}
