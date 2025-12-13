import { Serialize } from "@mcbe/serialize";

@Serialize({ transparent: "version" })
export class FormatVersion {
  @Serialize({
    custom: [(v) => `${v[0]}.${v[1]}.${v[2]}`, "normal"],
  })
  version: [number, number, number];

  constructor(version: [number, number, number]) {
    this.version = version;
  }
}
