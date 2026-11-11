import { ModuleBase } from "./typeModuleBase";

export interface ModuleCreate extends ModuleBase {
  is_parent: boolean;
  parent_id: number | null;
  icon: File | null;
}