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
    input: InputProps<
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
    this.delay = input.delay ?? 0;
    this.hitboxMargin = input.hitboxMargin ?? 0;
    this.reach = input.reach ?? DEFAULT_REACH;
    this.creativeReach = input.creativeReach ?? DEFAULT_REACH;
    this.damageMultiplier = input.damageMultiplier ?? 1;
    this.damageModifier = input.damageModifier ?? 0;
    this.damageConditions = input.damageConditions;
    this.dismountConditions = input.dismountConditions;
    this.knockbackConditions = input.knockbackConditions;
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
    input: InputProps<
      KineticWeaponEffectConditions,
      never,
      "maxDuration" | "minRelativeSpeed" | "minSpeed"
    >,
  ) {
    this.maxDuration = input.maxDuration ?? -1;
    this.minRelativeSpeed = input.minRelativeSpeed ?? 0;
    this.minSpeed = input.minSpeed ?? 0;
  }
}
