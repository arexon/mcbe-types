import { Serialize } from "@mcbe/serialize";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class ItemVisualBlockComponent implements ComponentNamespace {
  @Serialize()
  geometry: GeometryBlockComponent;

  @Serialize()
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
