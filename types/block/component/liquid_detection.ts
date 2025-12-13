import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class LiquidDetectionBlockComponent implements ComponentNamespace {
  @Ser()
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

@Ser()
export class LiquidDetectionRule {
  @Ser()
  liquidType: "water";

  @Ser({ default: () => false })
  canContainLiquid: boolean;

  @Ser({ default: () => "blocking" })
  onLiquidTouches: "blocking" | "broken" | "popped" | "no_reaction";

  @Ser({ default: () => [] })
  stopsLiquidFlowingFromDirection: (
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west"
  )[];

  @Ser({ default: () => false })
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
