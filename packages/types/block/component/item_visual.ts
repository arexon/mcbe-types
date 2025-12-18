import { SerClass, SerField } from "@mcbe/serialize";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class ItemVisualBlockComponent implements ComponentNamespace {
  @SerField()
  geometry: GeometryBlockComponent;

  @SerField()
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
