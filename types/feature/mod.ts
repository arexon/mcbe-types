import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { AggregateFeature, SingleBlockFeature } from "@mcbe/types/feature";
import type { Molang } from "@mcbe/types/molang";
import { maybeConstructArray } from "../_utils.ts";

export * from "./aggregate.ts";
export * from "./rule.ts";
export * from "./single_block.ts";

export type Feature = SingleBlockFeature | AggregateFeature;

export type FeatureReference = string | Feature;

export type PlacementPass =
  | "first_pass"
  | "before_underground_pass"
  | "underground_pass"
  | "after_underground_pass"
  | "before_surface_pass"
  | "surface_pass"
  | "after_surface_pass"
  | "before_sky_pass"
  | "sky_pass"
  | "after_sky_pass"
  | "final_pass";

export type FeatureCoordinateEvalOrder =
  | "xyz"
  | "xzy"
  | "yxz"
  | "yzx"
  | "zxy"
  | "zyx";

export type ScatterDistributionKind =
  | "fixed_grid"
  | "gaussian"
  | "inverse_gaussian"
  | "jittered_grid"
  | "triangle"
  | "uniform";

@Ser()
export class ScatterDistribution {
  @Ser()
  distribution: ScatterDistributionKind;

  @Ser()
  extent: [Molang, Molang];

  @Ser()
  gridOffset?: number;

  @Ser()
  stepSize?: number;

  constructor(
    distribution: ScatterDistributionKind,
    extent: [Molang, Molang],
    gridOffset?: number,
    stepSize?: number,
  ) {
    this.distribution = distribution;
    this.extent = extent;
    this.gridOffset = gridOffset;
    this.stepSize = stepSize;
  }
}

export type BiomeFilterTest =
  | "has_biome_tag"
  | "is_biome"
  | "is_snow_covered"
  | "is_humid"
  | "is_temperature_type"
  | "is_temperature_value";

export type BiomeFilterOperator = "==" | "!=";

@Ser()
export class BiomeFilterSingle {
  @Ser()
  test: BiomeFilterTest;

  @Ser({ default: () => "==" })
  operator: BiomeFilterOperator;

  @Ser()
  value: string;

  constructor(test: BiomeFilterTest, value: string);
  constructor(
    test: BiomeFilterTest,
    operator: BiomeFilterOperator,
    value: string,
  );
  constructor(
    test: BiomeFilterTest,
    operatorOrValue: BiomeFilterOperator | string,
    value?: string,
  ) {
    this.test = test;
    if (value === undefined) {
      this.operator = "==";
      this.value = operatorOrValue as string;
    } else {
      this.operator = operatorOrValue as BiomeFilterOperator;
      this.value = value;
    }
  }
}

@Ser()
export class BiomeFilterMulti {
  @Ser({ default: () => [] })
  anyOf: BiomeFilterSingle[];

  @Ser({ default: () => [] })
  allOf: BiomeFilterSingle[];

  constructor(input: InputProps<BiomeFilterMulti, never, "anyOf" | "allOf">) {
    this.anyOf = maybeConstructArray(input.anyOf ?? [], BiomeFilterSingle);
    this.allOf = maybeConstructArray(input.allOf ?? [], BiomeFilterSingle);
  }
}

@Ser()
export class ScatterChance {
  @Ser()
  numerator: number;

  @Ser()
  denominator: number;

  constructor(numerator: number, denominator: number) {
    this.numerator = numerator;
    this.denominator = denominator;
  }
}
