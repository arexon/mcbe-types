import { Ser } from "@mcbe/serialize";
import type { InputProps, InstanceResolvable } from "@mcbe/types/common";
import {
  BiomeFilterMulti,
  BiomeFilterSingle,
  type Feature,
  type FeatureCoordinateEvalOrder,
  type FeatureReference,
  type PlacementPass,
  ScatterChance,
  ScatterDistribution,
} from "@mcbe/types/feature";
import type { Molang } from "@mcbe/types/molang";
import type { FormatVersion } from "@mcbe/types/version";
import { maybeConstruct, maybeConstructArray } from "../_utils.ts";

const PATH = "minecraft:feature_rule";

@Ser()
export class FeatureRule implements InstanceResolvable<Feature> {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: PATH + "/description" })
  identifier: string;

  @Ser({
    custom: [(v) => {
      if (typeof v === "object" && v !== null && "identifier" in v) {
        return v.identifier;
      }
      return v;
    }, "normal"],
    path: PATH + "/description",
  })
  placesFeature: FeatureReference;

  @Ser({ path: PATH + "/conditions" })
  placementPass: PlacementPass;

  @Ser({
    path: PATH + "/conditions",
    rename: "minecraft:biome_filter",
  })
  biomeFilter:
    | (BiomeFilterSingle | BiomeFilterMulti)
    | (BiomeFilterSingle | BiomeFilterMulti)[];

  @Ser({ path: PATH + "/distribution" })
  iterations: Molang;

  @Ser({ path: PATH + "/distribution" })
  x: Molang | ScatterDistribution;

  @Ser({ path: PATH + "/distribution" })
  y: Molang | ScatterDistribution;

  @Ser({ path: PATH + "/distribution" })
  z: Molang | ScatterDistribution;

  @Ser({ default: () => "xyz" })
  coordinateEvalOrder: FeatureCoordinateEvalOrder;

  @Ser()
  scatterChance?: ScatterChance;

  constructor(
    formatVersion: FormatVersion,
    input: InputProps<
      FeatureRule,
      | "identifier"
      | "placesFeature"
      | "placementPass"
      | "biomeFilter"
      | "iterations"
      | "x"
      | "y"
      | "z"
      | "scatterChance",
      "coordinateEvalOrder"
    >,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = input.identifier;
    this.placesFeature = input.placesFeature;
    this.placementPass = input.placementPass;
    if (Array.isArray(input.biomeFilter)) {
      this.biomeFilter = maybeConstructArray(
        input.biomeFilter,
        BiomeFilterSingle,
        BiomeFilterMulti,
      );
    } else {
      this.biomeFilter = maybeConstruct(
        input.biomeFilter,
        BiomeFilterSingle,
        BiomeFilterMulti,
      );
    }
    this.iterations = input.iterations;
    this.x = maybeConstruct(input.x, ScatterDistribution);
    this.y = maybeConstruct(input.y, ScatterDistribution);
    this.z = maybeConstruct(input.z, ScatterDistribution);
    this.coordinateEvalOrder = input.coordinateEvalOrder ?? "xyz";
    this.scatterChance = maybeConstruct(input.scatterChance, ScatterChance);
  }

  resolveInstances(): Feature[] {
    const result: Feature[] = [];
    if (typeof this.placesFeature === "object") {
      result.push(this.placesFeature);
    }
    return result;
  }
}
