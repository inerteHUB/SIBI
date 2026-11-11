import { RoleBase } from "./typeRoleBase";

export interface RolePermissionModulePermission {
  id: number;
  module_id: number;
  permission_id: number;
}

export interface RolePermissionView {
  id: number;
  module_permission_id: number;
  module_permission: RolePermissionModulePermission;
}

export interface RoleView extends RoleBase {
  id: number;
  role_permissions: RolePermissionView[];
}