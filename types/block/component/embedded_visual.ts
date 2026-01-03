import { Edres } from "@mcbe/edres";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

// NOTE: Cannot be used in permutations.

@Edres()
export class EmbeddedVisualBlockComponent implements ComponentNamespace {
  @Edres()
  geometry: GeometryBlockComponent;

  @Edres()
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
