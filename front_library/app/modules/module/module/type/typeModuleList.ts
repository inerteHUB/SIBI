import { ModuleBase } from "./typeModuleBase";

export interface ModuleList extends ModuleBase {
    id: number;
    icon: string | null;
    is_parent: boolean;
    parent_id: number;
}