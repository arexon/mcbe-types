import type {
  CollisionBoxBlockComponent,
  ConnectionRuleBlockComponent,
  CraftingTableBlockComponent,
  DestructibleByExplosionBlockComponent,
  DestructionParticlesBlockComponent,
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
  TagBlockComponent,
  TickBlockComponent,
  TransformationBlockComponent,
} from "@mcbe/types/block";
import {
  Components,
  type CustomComponent,
  type DisplayNameComponent,
} from "@mcbe/types/common";

export type BlockComponent =
  | LightDampeningBlockComponent
  | CollisionBoxBlockComponent
  | MapColorBlockComponent
  | ConnectionRuleBlockComponent
  | CraftingTableBlockComponent
  | DestructibleByExplosionBlockComponent
  | DestructibleByExplosionBlockComponent
  | DestructionParticlesBlockComponent
  | FlammableBlockComponent
  | GeometryBlockComponent
  | ItemVisualBlockComponent
  | MaterialInstancesBlockComponent
  | SelectionBoxBlockComponent
  | DisplayNameComponent
  | LightDampeningBlockComponent
  | LightEmissionBlockComponent
  | LiquidDetectionBlockComponent
  | LootBlockComponent
  | FrictionBlockComponent
  | MovableBlockComponent
  | PlacementFilterBlockComponent
  | PrecipitationInteractionsBlockComponent
  | RedstoneConductivityBlockComponent
  | ReplaceableBlockComponent
  | SupportBlockComponent
  | TransformationBlockComponent
  | TickBlockComponent
  | RedstoneProducerBlockComponent
  | RandomOffsetBlockComponent
  | FlowerPottableBlockComponent
  | EntityFallOnBlockComponent
  | EmbeddedVisualBlockComponent
  | TagBlockComponent
  | CustomComponent;

// deno-lint-ignore style-guide/class-serialization
export class BlockComponents extends Components<BlockComponent> {}

export * from "./breathability.ts";
export * from "./collision_box.ts";
export * from "./connection_rule.ts";
export * from "./crafting_table.ts";
export * from "./destructible_by_explosion.ts";
export * from "./destructible_by_mining.ts";
export * from "./destruction_particles.ts";
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
export * from "./tag.ts";
export * from "./tick.ts";
export * from "./transformation.ts";
