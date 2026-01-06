import type { DisplayNameComponent } from "@mcbe/types/common";
import type * as item from "@mcbe/types/item";

export type ItemComponent =
  | DisplayNameComponent
  | item.AllowOfHandItemComponent
  | item.BlockPlacerItemComponent
  | item.BundleInteractionItemComponent
  | item.CanDestroyInCreativeItemComponent
  | item.CompostableItemComponent
  | item.CooldownItemComponent
  | item.DamageAbsorptionItemComponent
  | item.DamageItemComponent
  | item.DiggerItemComponent
  | item.DurabilityItemComponent
  | item.DurabilitySensorItemComponent
  | item.DyeableItemComponent
  | item.EnchantableItemComponent
  | item.FireResistantItemComponent
  | item.FoodItemComponent
  | item.FuelItemComponent
  | item.GlintItemComponent
  | item.HandEquippedItemComponent
  | item.HoverTextColorItemComponent
  | item.IconItemComponent
  | item.InteractButtonItemComponent
  | item.LiquidClippedItemComponent
  | item.MaxStackSizeItemComponent
  | item.PiercingWeaponItemComponent
  | item.ProjectileItemComponent
  | item.RarityItemComponent
  | item.RecordItemComponent
  | item.RepairableItemComponent
  | item.ShooterItemComponent
  | item.ShouldDespawnItemComponent
  | item.StorageItemComponent
  | item.StorageWeightLimitItemComponent
  | item.StorageWeightModifierItemComponent
  | item.SwingDurationItemComponent
  | item.SwingSoundsItemComponent
  | item.TagsItemComponent
  | item.ThrowableItemComponent
  | item.UseAnimationItemComponent
  | item.UseModifiersItemComponent
  | item.WearableItemComponent;

export * from "./allow_off_hand.ts";
export * from "./block_placer.ts";
export * from "./bundle_interaction.ts";
export * from "./can_destroy_in_creative.ts";
export * from "./compostable.ts";
export * from "./cooldown.ts";
export * from "./damage.ts";
export * from "./damage_absorption.ts";
export * from "./digger.ts";
export * from "./durability.ts";
export * from "./durability_sensor.ts";
export * from "./dyeable.ts";
export * from "./enchantable.ts";
export * from "./fire_resistant.ts";
export * from "./food.ts";
export * from "./fuel.ts";
export * from "./glint.ts";
export * from "./hand_equipped.ts";
export * from "./hover_text_color.ts";
export * from "./icon.ts";
export * from "./interact_button.ts";
export * from "./liquid_clipped.ts";
export * from "./max_stack_size.ts";
export * from "./piercing_weapon.ts";
export * from "./projectile.ts";
export * from "./rarity.ts";
export * from "./record.ts";
export * from "./repairable.ts";
export * from "./shooter.ts";
export * from "./should_despawn.ts";
export * from "./stacked_by_data.ts";
export * from "./storage_item.ts";
export * from "./storage_weight_limit.ts";
export * from "./storage_weight_modifier.ts";
export * from "./swing_duration.ts";
export * from "./swing_sounds.ts";
export * from "./tags.ts";
export * from "./throwable.ts";
export * from "./use_animation.ts";
export * from "./use_modifiers.ts";
export * from "./wearable.ts";
