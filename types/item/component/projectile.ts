import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class ProjectileItemComponent implements ComponentNamespace {
  @Ser()
  projectileEntity: string;

  @Ser({ default: () => 0 })
  minimumCriticalPower: number;

  get namespace(): string {
    return "minecraft:projectile";
  }

  constructor(
    input: InputProps<
      ProjectileItemComponent,
      "projectileEntity",
      "minimumCriticalPower"
    >,
  ) {
    this.projectileEntity = input.projectileEntity;
    this.minimumCriticalPower = input.minimumCriticalPower ?? 0;
  }
}
