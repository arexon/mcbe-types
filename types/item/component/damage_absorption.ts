import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class DamageAbsorptionItemComponent implements ComponentNamespace {
  @Ser()
  absorbableCauses: DamageCause[];

  get namespace(): string {
    return "minecraft:damage_absorption";
  }

  constructor(
    props: InputProps<DamageAbsorptionItemComponent, "absorbableCauses">,
  ) {
    this.absorbableCauses = props.absorbableCauses;
  }
}

export type DamageCause =
  | "all"
  | "anvil"
  | "any"
  | "attack"
  | "block_explosion"
  | "campfire"
  | "charging"
  | "contact"
  | "drowning"
  | "entity_attack"
  | "entity_explosion"
  | "fall"
  | "falling_block"
  | "fatal"
  | "fire"
  | "fire_tick"
  | "fireworks"
  | "fly_into_wall"
  | "freezing"
  | "lava"
  | "lightning"
  | "mace_smash"
  | "magic"
  | "magma"
  | "none"
  | "override"
  | "piston"
  | "projectile"
  | "ram_attack"
  | "self_destruct"
  | "sonic_boom"
  | "soul_campfire"
  | "stalactite"
  | "stalagmite"
  | "starve"
  | "suffocation"
  | "temperature"
  | "thorns"
  | "void"
  | "wither";
