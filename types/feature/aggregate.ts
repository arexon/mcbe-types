import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";
import type { FeatureReference } from "@mcbe/types/feature";
import { resolveInstances } from "../_utils.ts";

const path = "minecraft:aggregate_feature";

export type FeatureEarlyOut = "none" | "first_success" | "first_failure";

@Ser()
export class AggregateFeature {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: path + "/description" })
  identifier: string;

  @Ser({
    path,
    custom: [resolveInstances, "normal"],
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
}
