import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "version" })
export class FormatVersion {
  @SerField({
    custom: [(v) => `${v[0]}.${v[1]}.${v[2]}`, "normal"],
  })
  version: [number, number, number];

  constructor(version: [number, number, number]) {
    this.version = version;
  }
}
