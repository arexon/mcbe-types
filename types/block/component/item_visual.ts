import { Edres } from "@mcbe/edres";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class ItemVisualBlockComponent implements ComponentNamespace {
  @Edres()
  geometry: GeometryBlockComponent;

  @Edres()
  materialInstances: MaterialInstancesBlockComponent;

  get namespace(): string {
    return "minecraft:item_visual";
  }

  constructor(
    props: InputProps<
      ItemVisualBlockComponent,
      "geometry" | "materialInstances"
    >,
  ) {
    this.geometry = props.geometry;
    this.materialInstances = props.materialInstances;
  }
}
