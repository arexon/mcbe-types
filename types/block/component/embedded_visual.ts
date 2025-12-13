import { Ser } from "@mcbe/serialize";
import type {
  GeometryBlockComponent,
  MaterialInstancesBlockComponent,
} from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

// NOTE: Cannot be used in permutations.

@Ser()
export class EmbeddedVisualBlockComponent implements ComponentNamespace {
  @Ser()
  geometry: GeometryBlockComponent;

  @Ser()
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
