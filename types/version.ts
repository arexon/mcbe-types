import { Edres } from "@mcbe/edres";

@Edres({ transparent: "version" })
export class FormatVersion {
  @Edres({
    custom: [(v) => `${v[0]}.${v[1]}.${v[2]}`, "normal"],
  })
  version: [number, number, number];

  constructor(version: [number, number, number]) {
    this.version = version;
  }
}
