import { Ser } from "@mcbe/serialize";
import type { InputProps, InstanceResolvable } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";
import type { Feature, FeatureReference } from "@mcbe/types/feature";

const path = "minecraft:aggregate_feature";

export type FeatureEarlyOut = "none" | "first_success" | "first_failure";

@Ser()
export class AggregateFeature implements InstanceResolvable<Feature> {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: path + "/description" })
  identifier: string;

  @Ser({
    path,
    custom: [(v) => {
      for (let i = 0; i < v.length; i++) {
        const ft = v[i];
        if (typeof ft === "object" && ft !== null && "identifier" in ft) {
          v[i] = ft.identifier;
        }
      }
      return v;
    }, "normal"],
  })
  features: FeatureReference[];

  @Ser({ path, default: () => "none" })
  earlyOut: FeatureEarlyOut;

  constructor(
    formatVersion: FormatVersion,
    input: InputProps<
      AggregateFeature,
      "identifier" | "features",
      "earlyOut"
    >,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = input.identifier;
    this.features = input.features;
    this.earlyOut = input.earlyOut ?? "none";
  }

  resolveInstances(): Feature[] {
    const result: Feature[] = [];
    for (const feature of this.features) {
      if (typeof feature === "object") result.push(feature);
    }
    return result;
  }
}
