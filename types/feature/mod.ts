import type { AggregateFeature, SingleBlockFeature } from "@mcbe/types/feature";

export * from "./single_block.ts";
export * from "./aggregate.ts";

export type Feature = SingleBlockFeature | AggregateFeature;

export type FeatureReference = string | Feature;
