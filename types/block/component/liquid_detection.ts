import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class LiquidDetectionBlockComponent implements ComponentNamespace {
  @Edres()
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

@Edres()
export class LiquidDetectionRule {
  @Edres()
  liquidType: "water";

  @Edres({ default: () => false })
  canContainLiquid: boolean;

  @Edres({ default: () => "blocking" })
  onLiquidTouches: "blocking" | "broken" | "popped" | "no_reaction";

  @Edres({ default: () => [] })
  stopsLiquidFlowingFromDirection: (
    | "up"
    | "down"
    | "north"
    | "south"
    | "east"
    | "west"
  )[];

  @Edres({ default: () => false })
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
