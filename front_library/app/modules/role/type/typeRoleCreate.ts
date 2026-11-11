import { RoleBase } from "./typeRoleBase";

export interface RoleCreate extends RoleBase {
  modules: SelectedModule[];
}

export interface SelectedModule {
  moduleId: number;
  permissionIds: number[];
}