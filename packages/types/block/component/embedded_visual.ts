import { SerClass, SerField } from "@mcbe/serialize";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/shared";

// NOTE: Cannot be used in permutations.

@SerClass()
export class EmbeddedVisualBlockComponent {
  @SerField()
  geometry: GeometryBlockComponent;

  @SerField()
  materialInstances: MaterialInstancesBlockComponent;

  readonly namespace = "minecraft:embedded_visual";

  constructor(
    props: InputProps<
      EmbeddedVisualBlockComponent,
      "geometry" | "materialInstances"
    >,
  ) {
    this.geometry = props.geometry;
    this.materialInstances = props.materialInstances;
  }
}
