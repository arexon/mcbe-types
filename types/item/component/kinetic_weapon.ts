import { Ser } from "@mcbe/serialize";
import {
  type ComponentNamespace,
  type InputProps,
  Range,
} from "@mcbe/types/common";

const DEFAULT_REACH = new Range(0, 3);

@Ser()
export class KineticWeaponItemComponent implements ComponentNamespace {
  @Ser({ default: () => 0 })
  delay: number;

  @Ser({ default: () => 0 })
  hitboxMargin: number;

  @Ser({
    default: () => DEFAULT_REACH,
    custom: [Range.customObject, "normal"],
  })
  reach: Range;

  @Ser({
    default: () => DEFAULT_REACH,
    custom: [Range.customObject, "normal"],
  })
  creativeReach: Range;

  @Ser({ default: () => 1 })
  damageMultiplier: number;

  @Ser({ default: () => 0 })
  damageModifier: number;

  @Ser()
  damageConditions?: KineticWeaponEffectConditions;

  @Ser()
  dismountConditions?: KineticWeaponEffectConditions;

  @Ser()
  knockbackConditions?: KineticWeaponEffectConditions;

  get namespace(): string {
    return "minecraft:kinetic_weapon";
  }

  constructor(
    props: InputProps<
      KineticWeaponItemComponent,
      "damageConditions" | "dismountConditions" | "knockbackConditions",
      | "delay"
      | "hitboxMargin"
      | "reach"
      | "creativeReach"
      | "damageMultiplier"
      | "damageModifier"
    >,
  ) {
    this.delay = props.delay ?? 0;
    this.hitboxMargin = props.hitboxMargin ?? 0;
    this.reach = props.reach ?? DEFAULT_REACH;
    this.creativeReach = props.creativeReach ?? DEFAULT_REACH;
    this.damageMultiplier = props.damageMultiplier ?? 1;
    this.damageModifier = props.damageModifier ?? 0;
    this.damageConditions = props.damageConditions;
    this.dismountConditions = props.dismountConditions;
    this.knockbackConditions = props.knockbackConditions;
  }
}

@Ser()
export class KineticWeaponEffectConditions {
  @Ser({ default: () => -1 })
  maxDuration: number;

  @Ser({ default: () => 0 })
  minRelativeSpeed: number;

  @Ser({ default: () => 0 })
  minSpeed: number;

  constructor(
    props: InputProps<
      KineticWeaponEffectConditions,
      never,
      "maxDuration" | "minRelativeSpeed" | "minSpeed"
    >,
  ) {
    this.maxDuration = props.maxDuration ?? -1;
    this.minRelativeSpeed = props.minRelativeSpeed ?? 0;
    this.minSpeed = props.minSpeed ?? 0;
  }
}
