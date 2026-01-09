import { Ser } from "@mcbe/serialize";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

const mapRulesFn = (
  v: DerivedInputProps<typeof LiquidDetectionRule>,
): LiquidDetectionRule =>
  v instanceof LiquidDetectionRule ? v : new LiquidDetectionRule(v);

@Ser()
export class LiquidDetectionBlockComponent implements ComponentNamespace {
  @Ser()
  detectionRules: LiquidDetectionRule[];

  get namespace(): string {
    return "minecraft:liquid_detection";
  }

  constructor(
    input:
      | DerivedInputProps<typeof LiquidDetectionRule>[]
      | InputProps<LiquidDetectionBlockComponent, "detectionRules">,
  ) {
    if (Array.isArray(input)) {
      this.detectionRules = input.map(mapRulesFn);
    } else {
      this.detectionRules = input.detectionRules.map(mapRulesFn);
    }
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
    input: InputProps<
      LiquidDetectionRule,
      "liquidType" | "canContainLiquid",
      | "onLiquidTouches"
      | "stopsLiquidFlowingFromDirection"
      | "useLiquidClipping"
    >,
  ) {
    this.liquidType = input.liquidType;
    this.canContainLiquid = input.canContainLiquid;
    this.onLiquidTouches = input.onLiquidTouches ?? "blocking";
    this.stopsLiquidFlowingFromDirection =
      input.stopsLiquidFlowingFromDirection ?? [];
    this.useLiquidClipping = input.useLiquidClipping ?? false;
  }
}
