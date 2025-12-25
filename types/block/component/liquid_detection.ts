import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class LiquidDetectionBlockComponent implements ComponentNamespace {
  @Serialize()
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

@Serialize()
export class LiquidDetectionRule {
  @Serialize()
  liquidType: "water";

  @Serialize({ default: () => false })
  canContainLiquid: boolean;

  @Serialize({ default: () => "blocking" })
  onLiquidTouches: "blocking" | "broken" | "popped" | "no_reaction";

  @Serialize({ default: () => [] })
  stopsLiquidFlowingFromDirection: (
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west"
  )[];

  @Serialize({ default: () => false })
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
