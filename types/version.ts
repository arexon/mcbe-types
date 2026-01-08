import { Ser } from "@mcbe/serialize";
import type { Vec3 } from "@mcbe/types/common";

@Ser({ transparent: "version" })
export class FormatVersion {
  @Ser({
    custom: [(v) => `${v[0]}.${v[1]}.${v[2]}`, "normal"],
  })
  version: Vec3;

  constructor(major: number, minor: number, patch: number) {
    this.version = [major, minor, patch];
  }
}
