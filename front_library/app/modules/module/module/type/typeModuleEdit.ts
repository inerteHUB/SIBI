import { ModuleBase } from "./typeModuleBase";

export interface ModuleEdit extends ModuleBase {
  is_parent: boolean;
  parent_id: number | null;
  icon: File | null;
  remove_icon: boolean;
}