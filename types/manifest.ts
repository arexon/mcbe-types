import { Ser } from "@mcbe/serialize";
import { type InputProps, TOOL_NAME, type Vec3 } from "@mcbe/types/common";
import denoJson from "./deno.json" with { type: "json" };
import type { Uuid } from "@mcbe/types/uuid";

export type ManifestFormatVersion = 2 | 3;

type ManifestVersion<
  FV extends ManifestFormatVersion,
> = FV extends 3 ? string : Vec3;

@Ser()
export class Manifest<FV extends ManifestFormatVersion = 2> {
  @Ser()
  formatVersion: FV;

  @Ser()
  header: ManifestHeader<FV>;

  @Ser()
  modules: ManifestModule<FV>[] = [];

  @Ser({
    custom: [(deps) =>
      deps.map((dep) => {
        if (dep instanceof Manifest) {
          return { uuid: dep.header.uuid, version: dep.header.version };
        }
        return dep;
      }), "normal"],
    default: () => [],
  })
  dependencies: ManifestDependency<FV>[];

  @Ser()
  metadata?: ManifestMetadata;

  @Ser({ default: () => [] })
  capabilities: ManifestCapability[];

  // deno-lint-ignore no-explicit-any
  @Ser({ default: () => [] as any })
  settings: FV extends 3 ? PackSetting[] : never;

  constructor(
    formatVersion: FV,
    input: InputProps<
      Manifest<FV>,
      "header" | "modules" | "metadata",
      "dependencies" | "capabilities" | "settings"
    >,
  ) {
    this.formatVersion = formatVersion;
    this.header = input.header;
    this.modules = input.modules;
    this.dependencies = input.dependencies ?? [];
    this.metadata = input.metadata;
    this.capabilities = input.capabilities ?? [];
    // deno-lint-ignore no-explicit-any
    this.settings = input.settings ?? [] as any;
  }
}

// TODO: Support `base_game_version` & `lock_template_options`.
@Ser()
export class ManifestHeader<FV extends ManifestFormatVersion> {
  @Ser()
  name: string;

  @Ser()
  description: string;

  @Ser()
  uuid: Uuid;

  @Ser()
  version: ManifestVersion<FV>;

  @Ser()
  minEngineVersion: ManifestVersion<FV>;

  @Ser({ default: () => "any" })
  packScope: "global" | "world" | "any";

  constructor(
    input: InputProps<
      ManifestHeader<FV>,
      "name" | "description" | "uuid" | "version" | "minEngineVersion",
      "packScope"
    >,
  ) {
    this.name = input.name;
    this.description = input.description;
    this.uuid = input.uuid;
    this.version = input.version;
    this.minEngineVersion = input.minEngineVersion;
    this.packScope = input.packScope ?? "any";
  }
}

// TODO: Support `world_template`.
export type ManifestModule<FV extends ManifestFormatVersion> =
  | ManifestResourceModule<FV>
  | ManifestDataModule<FV>
  | ManifestScriptModule<FV>;

@Ser()
export class ManifestResourceModule<FV extends ManifestFormatVersion> {
  @Ser()
  readonly type: "resource" = "resource";

  @Ser()
  description?: string;

  @Ser()
  uuid: Uuid;

  @Ser()
  version: ManifestVersion<FV>;

  constructor(
    input: InputProps<
      ManifestResourceModule<FV>,
      "description" | "uuid" | "version"
    >,
  ) {
    this.description = input.description;
    this.uuid = input.uuid;
    this.version = input.version;
  }
}

@Ser()
export class ManifestDataModule<FV extends ManifestFormatVersion> {
  @Ser()
  readonly type: "data" = "data";

  @Ser()
  description?: string;

  @Ser()
  uuid: Uuid;

  @Ser()
  version: ManifestVersion<FV>;

  constructor(
    input: InputProps<
      ManifestDataModule<FV>,
      "description" | "uuid" | "version"
    >,
  ) {
    this.description = input.description;
    this.uuid = input.uuid;
    this.version = input.version;
  }
}

@Ser()
export class ManifestScriptModule<FV extends ManifestFormatVersion> {
  @Ser()
  readonly type: "script" = "script";

  @Ser()
  description?: string;

  @Ser()
  uuid: Uuid;

  @Ser()
  version: ManifestVersion<FV>;

  @Ser()
  entry: string;

  @Ser()
  readonly language: "javascript" = "javascript";

  constructor(
    input: InputProps<
      ManifestScriptModule<FV>,
      "description" | "uuid" | "version" | "entry"
    >,
  ) {
    this.description = input.description;
    this.uuid = input.uuid;
    this.version = input.version;
    this.entry = input.entry;
  }
}

export type ManifestDependency<FV extends ManifestFormatVersion> =
  | ManifestScriptDependency<FV>
  | Manifest;

export type ManifestScriptModuleName =
  | "@minecraft/server"
  | "@minecraft/server-gametest"
  | "@minecraft/server-ui"
  | "@minecraft/server-admin"
  | "@minecraft/server-editor"
  | "@minecraft/debug-utilities";

@Ser()
export class ManifestScriptDependency<FV extends ManifestFormatVersion> {
  @Ser()
  moduleName: ManifestScriptModuleName | Uuid;

  @Ser()
  version: ManifestVersion<FV>;

  constructor(
    input: InputProps<ManifestScriptDependency<FV>, "moduleName" | "version">,
  ) {
    this.moduleName = input.moduleName;
    this.version = input.version;
  }
}

@Ser()
export class ManifestMetadata {
  @Ser()
  authors?: string | string[];

  @Ser()
  license?: string;

  @Ser()
  url?: string;

  @Ser({
    custom: [(v) => {
      if (v === undefined) return { [TOOL_NAME]: [denoJson.version] };
      return v[TOOL_NAME] = [denoJson.version], v;
    }, "normal"],
  })
  generatedWith?: Record<string, string[]>;

  @Ser()
  readonly productType: "addon" = "addon";

  constructor(
    input: InputProps<
      ManifestMetadata,
      "authors" | "license" | "url" | "generatedWith"
    >,
  ) {
    this.authors = input.authors;
    this.license = input.license;
    this.url = input.url;
    this.generatedWith = input.generatedWith;
  }
}

export enum ManifestCapability {
  Chemistry = "chemistry",
  EditorExtension = "editor_extension",
  ExperimentalCustomUI = "experimental_custom_ui",
  PBR = "pbr",
  Raytraced = "raytraced",
  ScriptEval = "script_eval",
}

export type PackSetting =
  | PackLabelSetting
  | PackToggleSetting
  | PackSliderSetting
  | PackDropdownSetting<{ text: string; value: string }>;

@Ser()
export class PackLabelSetting {
  @Ser()
  readonly type: "label" = "label";

  @Ser()
  text: string;

  constructor(text: string) {
    this.text = text;
  }
}

@Ser()
export class PackToggleSetting {
  @Ser()
  readonly type: "toggle" = "toggle";

  @Ser()
  text: string;

  @Ser()
  name: string;

  @Ser()
  default: boolean;

  constructor(
    input: InputProps<PackToggleSetting, "text" | "name" | "default">,
  ) {
    this.text = input.text;
    this.name = input.name;
    this.default = input.default;
  }
}

@Ser()
export class PackSliderSetting {
  @Ser()
  readonly type: "slider" = "slider";

  @Ser()
  text: string;

  @Ser()
  name: string;

  @Ser()
  min: number;

  @Ser()
  max: number;

  @Ser()
  step: number;

  @Ser()
  default: number;

  constructor(
    input: InputProps<
      PackSliderSetting,
      "text" | "name" | "min" | "max" | "step" | "default"
    >,
  ) {
    this.text = input.text;
    this.name = input.name;
    this.min = input.min;
    this.max = input.max;
    this.step = input.step;
    this.default = input.default;
  }
}

@Ser()
export class PackDropdownSetting<
  const Option extends { text: string; value: string },
> {
  @Ser()
  readonly type: "dropdown" = "dropdown";

  @Ser()
  text: string;

  @Ser()
  name: string;

  @Ser()
  options: Option[];

  @Ser()
  default: Option[][number]["value"];

  constructor(
    input: InputProps<
      PackDropdownSetting<Option>,
      "text" | "name" | "options" | "default"
    >,
  ) {
    this.text = input.text;
    this.name = input.name;
    this.options = input.options;
    this.default = input.default;
  }
}
