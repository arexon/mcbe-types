import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class LiquidDetectionBlockComponent implements ComponentNamespace {
  @SerField()
  detectionRules: LiquidDetectionRule[];

  get namespace(): string {
    return "minecraft:liquid_detection";
  }

  constructor(
    props: InputProps<LiquidDetectionBlockComponent, "detectionRules">,
  ) {
    this.detectionRules = props.detectionRules;
  }
}

@SerClass()
export class LiquidDetectionRule {
  @SerField()
  liquidType: "water";

  @SerField({ default: () => false })
  canContainLiquid: boolean;

  @SerField({ default: () => "blocking" })
  onLiquidTouches: "blocking" | "broken" | "popped" | "no_reaction";

  @SerField({ default: () => [] })
  stopsLiquidFlowingFromDirection: (
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west"
  )[];

  @SerField({ default: () => false })
  useLiquidClipping: boolean;

  constructor(
    props: InputProps<
      LiquidDetectionRule,
      "liquidType" | "canContainLiquid",
      | "onLiquidTouches"
      | "stopsLiquidFlowingFromDirection"
      | "useLiquidClipping"
    >,
  ) {
    this.liquidType = props.liquidType;
    this.canContainLiquid = props.canContainLiquid;
    this.onLiquidTouches = props.onLiquidTouches ?? "blocking";
    this.stopsLiquidFlowingFromDirection =
      props.stopsLiquidFlowingFromDirection ?? [];
    this.useLiquidClipping = props.useLiquidClipping ?? false;
  }
}
