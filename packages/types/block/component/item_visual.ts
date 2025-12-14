import { SerClass, SerField } from "@mcbe/serialize";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class ItemVisualBlockComponent {
  @SerField()
  geometry: GeometryBlockComponent;

  @SerField()
  materialInstances: MaterialInstancesBlockComponent;

  static namespace: string = "minecraft:item_visual";

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
