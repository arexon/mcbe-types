import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

@Ser()
export class ProjectileItemComponent implements ComponentNamespace {
  @Ser()
  projectileEntity: Identifier;

  @Ser({ default: () => 0 })
  minimumCriticalPower: number;

  get namespace(): string {
    return "minecraft:projectile";
  }

  constructor(
    props: InputProps<
      ProjectileItemComponent,
      "projectileEntity",
      "minimumCriticalPower"
    >,
  ) {
    this.projectileEntity = props.projectileEntity;
    this.minimumCriticalPower = props.minimumCriticalPower ?? 0;
  }
}
