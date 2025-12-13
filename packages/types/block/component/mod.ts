import type { GeometryBlockComponent } from "@mcbe/types/block";
import type { NamespacedContainer } from "@mcbe/types/shared";

export type BlockComponents = NamespacedContainer<
  typeof GeometryBlockComponent
>;

export * from "./geometry.ts";
