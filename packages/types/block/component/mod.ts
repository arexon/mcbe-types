import type {
  CollisionBoxBlockComponent,
  ConnectionRuleBlockComponent,
  CraftingTableBlockComponent,
  DestructibleByExplosionBlockComponent,
  DestructionParticlesBlockComponent,
  DisplayNameBlockComponent,
  EmbeddedVisualBlockComponent,
  EntityFallOnBlockComponent,
  FlammableBlockComponent,
  FlowerPottableBlockComponent,
  FrictionBlockComponent,
  GeometryBlockComponent,
  ItemVisualBlockComponent,
  LightDampeningBlockComponent,
  LightEmissionBlockComponent,
  LiquidDetectionBlockComponent,
  LootBlockComponent,
  MapColorBlockComponent,
  MaterialInstancesBlockComponent,
  MovableBlockComponent,
  PlacementFilterBlockComponent,
  PrecipitationInteractionsBlockComponent,
  RandomOffsetBlockComponent,
  RedstoneConductivityBlockComponent,
  RedstoneProducerBlockComponent,
  ReplaceableBlockComponent,
  SelectionBoxBlockComponent,
  SupportBlockComponent,
  TickBlockComponent,
  TransformationBlockComponent,
} from "@mcbe/types/block";
import type { NamespacedContainer } from "@mcbe/types/shared";

export type BlockComponents = NamespacedContainer<
  | typeof LightDampeningBlockComponent
  | typeof CollisionBoxBlockComponent
  | typeof ConnectionRuleBlockComponent
  | typeof CraftingTableBlockComponent
  | typeof DestructibleByExplosionBlockComponent
  | typeof DestructibleByExplosionBlockComponent
  | typeof DestructionParticlesBlockComponent
  | typeof FlammableBlockComponent
  | typeof GeometryBlockComponent
  | typeof ItemVisualBlockComponent
  | typeof MaterialInstancesBlockComponent
  | typeof SelectionBoxBlockComponent
  | typeof DisplayNameBlockComponent
  | typeof LightDampeningBlockComponent
  | typeof LightEmissionBlockComponent
  | typeof LiquidDetectionBlockComponent
  | typeof LootBlockComponent
  | typeof MapColorBlockComponent
  | typeof FrictionBlockComponent
  | typeof MovableBlockComponent
  | typeof PlacementFilterBlockComponent
  | typeof PrecipitationInteractionsBlockComponent
  | typeof RedstoneConductivityBlockComponent
  | typeof ReplaceableBlockComponent
  | typeof SupportBlockComponent
  | typeof TransformationBlockComponent
  | typeof TickBlockComponent
  | typeof RedstoneProducerBlockComponent
  | typeof RandomOffsetBlockComponent
  | typeof FlowerPottableBlockComponent
  | typeof EntityFallOnBlockComponent
  | typeof EmbeddedVisualBlockComponent
>;

export * from "./breathability.ts";
export * from "./collision_box.ts";
export * from "./connection_rule.ts";
export * from "./crafting_table.ts";
export * from "./destructible_by_explosion.ts";
export * from "./destructible_by_mining.ts";
export * from "./destruction_particles.ts";
export * from "./display_name.ts";
export * from "./embedded_visual.ts";
export * from "./entity_fall_on.ts";
export * from "./flammable.ts";
export * from "./flower_pottable.ts";
export * from "./friction.ts";
export * from "./geometry.ts";
export * from "./item_visual.ts";
export * from "./light_dampening.ts";
export * from "./light_emission.ts";
export * from "./liquid_detection.ts";
export * from "./loot.ts";
export * from "./map_color.ts";
export * from "./material_instances.ts";
export * from "./movable.ts";
export * from "./placement_filter.ts";
export * from "./precipitation_interactions.ts";
export * from "./random_offset.ts";
export * from "./redstone_conductivity.ts";
export * from "./redstone_producer.ts";
export * from "./replaceable.ts";
export * from "./selection_box.ts";
export * from "./support.ts";
export * from "./tick.ts";
export * from "./transformation.ts";
