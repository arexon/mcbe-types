import { Ser } from "@mcbe/serialize";
import type { BlockDescriptor } from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/common";
import type { FormatVersion } from "@mcbe/types/version";
import { maybeConstruct } from "../_utils.ts";

const path = "minecraft:single_block_feature";

@Ser()
export class SingleBlockFeature {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: path + "/description" })
  identifier: string;

  @Ser({ path })
  placesBlock:
    | BlockDescriptor
    | { block: BlockDescriptor; weight: number }[];

  @Ser({ path })
  enforcePlacementRules: boolean;

  @Ser({ path })
  enforceSurvivabilityRules: boolean;

  @Ser({ path })
  mayAttachTo?: FeatureMayAttachTo;

  @Ser({ path })
  mayNotAttachTo?: FeatureMayNotAttachTo;

  @Ser({ path })
  mayReplace?: BlockDescriptor[];

  @Ser({ path, default: () => false })
  randomizeRotation: boolean;

  constructor(
    formatVersion: FormatVersion,
    input: InputProps<
      SingleBlockFeature,
      | "identifier"
      | "placesBlock"
      | "enforcePlacementRules"
      | "enforceSurvivabilityRules"
      | "mayAttachTo"
      | "mayNotAttachTo"
      | "mayReplace",
      "randomizeRotation"
    >,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = input.identifier;
    this.placesBlock = input.placesBlock;
    this.enforcePlacementRules = input.enforcePlacementRules;
    this.enforceSurvivabilityRules = input.enforceSurvivabilityRules;
    this.mayAttachTo = maybeConstruct(FeatureMayAttachTo, input.mayAttachTo);
    this.mayNotAttachTo = maybeConstruct(
      FeatureMayNotAttachTo,
      input.mayNotAttachTo,
    );
    this.mayReplace = input.mayReplace;
    this.randomizeRotation = input.randomizeRotation ?? false;
  }
}

@Ser()
export class FeatureMayAttachTo {
  @Ser()
  all?: BlockDescriptor[];

  @Ser()
  north?: BlockDescriptor[];

  @Ser()
  east?: BlockDescriptor[];

  @Ser()
  south?: BlockDescriptor[];

  @Ser()
  west?: BlockDescriptor[];

  @Ser()
  top?: BlockDescriptor[];

  @Ser()
  bottom?: BlockDescriptor[];

  @Ser()
  sides?: BlockDescriptor[];

  @Ser()
  diagonal?: BlockDescriptor[];

  @Ser()
  minSidesMustAttach?: 1 | 2 | 3 | 4;

  @Ser({ default: () => false })
  autoRotate: boolean;

  constructor(
    input: InputProps<
      FeatureMayAttachTo,
      | "all"
      | "north"
      | "east"
      | "south"
      | "west"
      | "top"
      | "bottom"
      | "sides"
      | "diagonal"
      | "minSidesMustAttach",
      "autoRotate"
    >,
  ) {
    this.all = input.all;
    this.north = input.north;
    this.east = input.east;
    this.south = input.south;
    this.west = input.west;
    this.top = input.top;
    this.bottom = input.bottom;
    this.sides = input.sides;
    this.diagonal = input.diagonal;
    this.minSidesMustAttach = input.minSidesMustAttach;
    this.autoRotate = input.autoRotate ?? false;
  }
}

@Ser()
export class FeatureMayNotAttachTo {
  @Ser()
  all?: BlockDescriptor[];

  @Ser()
  north?: BlockDescriptor[];

  @Ser()
  east?: BlockDescriptor[];

  @Ser()
  south?: BlockDescriptor[];

  @Ser()
  west?: BlockDescriptor[];

  @Ser()
  top?: BlockDescriptor[];

  @Ser()
  bottom?: BlockDescriptor[];

  @Ser()
  sides?: BlockDescriptor[];

  @Ser()
  diagonal?: BlockDescriptor[];

  constructor(
    input: InputProps<
      FeatureMayAttachTo,
      | "all"
      | "north"
      | "east"
      | "south"
      | "west"
      | "top"
      | "bottom"
      | "sides"
      | "diagonal"
    >,
  ) {
    this.all = input.all;
    this.north = input.north;
    this.east = input.east;
    this.south = input.south;
    this.west = input.west;
    this.top = input.top;
    this.bottom = input.bottom;
    this.sides = input.sides;
    this.diagonal = input.diagonal;
  }
}
