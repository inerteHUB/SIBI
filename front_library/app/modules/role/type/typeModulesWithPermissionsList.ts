export interface ModulePermissionItem {
    id: number;
    name: string;
}

export interface ModulesWithPermissionsList {
    id: number;
    name: string;
    icon: string | null;
    is_parent: boolean;
    path: string | null;
    permissions: ModulePermissionItem[];
    children: ModulesWithPermissionsList[];
}