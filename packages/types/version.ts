import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "version" })
export class FormatVersion {
  @SerField()
  version: string;

  constructor(version: [number, number, number]) {
    this.version = `${version[0]}.${version[1]}.${version[2]}`;
  }
}
