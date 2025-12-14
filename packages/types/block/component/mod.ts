import type {
  CollisionBoxBlockComponent,
  ConnectionRuleBlockComponent,
  CraftingTableBlockComponent,
  DestructibleByExplosionBlockComponent,
  DestructionParticlesBlockComponent,
  DisplayNameBlockComponent,
  FlammableBlockComponent,
  GeometryBlockComponent,
  ItemVisualBlockComponent,
  LightDampeningBlockComponent,
  LightEmissionBlockComponent,
  LiquidDetectionBlockComponent,
  LootBlockComponent,
  MapColorBlockComponent,
  MaterialInstancesBlockComponent,
  SelectionBoxBlockComponent,
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
>;

export * from "./breathability.ts";
export * from "./collision_box.ts";
export * from "./connection_rule.ts";
export * from "./crafting_table.ts";
export * from "./destructible_by_explosion.ts";
export * from "./destructible_by_mining.ts";
export * from "./destruction_particles.ts";
export * from "./display_name.ts";
export * from "./flammable.ts";
export * from "./geometry.ts";
export * from "./item_visual.ts";
export * from "./light_dampening.ts";
export * from "./light_emission.ts";
export * from "./liquid_detection.ts";
export * from "./loot.ts";
export * from "./map_color.ts";
export * from "./material_instances.ts";
export * from "./selection_box.ts";
