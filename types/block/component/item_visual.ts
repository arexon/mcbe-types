import { Ser } from "@mcbe/serialize";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class ItemVisualBlockComponent implements ComponentNamespace {
  @Ser()
  geometry: GeometryBlockComponent;

  @Ser()
  materialInstances: MaterialInstancesBlockComponent;

  get namespace(): string {
    return "minecraft:item_visual";
  }

  constructor(
    input: InputProps<
      ItemVisualBlockComponent,
      "geometry" | "materialInstances"
    >,
  ) {
    this.geometry = input.geometry;
    this.materialInstances = input.materialInstances;
  }
}
