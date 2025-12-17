import { SerClass, SerField } from "@mcbe/serialize";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/common";

// NOTE: Cannot be used in permutations.

@SerClass()
export class EmbeddedVisualBlockComponent {
  @SerField()
  geometry: GeometryBlockComponent;

  @SerField()
  materialInstances: MaterialInstancesBlockComponent;

  get namespace(): string {
    return "minecraft:embedded_visual";
  }

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
