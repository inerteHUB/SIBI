import { ModuleBase } from "./typeModuleBase";

export interface ModuleView extends ModuleBase {
    id: number | null;
    is_parent: boolean;
    parent_id: number | null;
    icon: string | null;
}