import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class RecordItemComponent implements ComponentNamespace {
  @Ser({ default: () => 0 })
  duration: number;

  @Ser({ default: () => 1 })
  comparatorSignal: number;

  @Ser()
  soundEvent?: string;

  get namespace(): string {
    return "minecraft:record";
  }

  constructor(
    props: InputProps<
      RecordItemComponent,
      "soundEvent",
      "duration" | "comparatorSignal"
    >,
  ) {
    this.soundEvent = props.soundEvent;
    this.duration = props.duration ?? 0;
    this.comparatorSignal = props.comparatorSignal ?? 1;
  }
}
