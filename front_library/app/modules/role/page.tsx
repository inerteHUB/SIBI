"use client";

// react
import { useEffect } from "react";

// componentes
import HeaderModule from "@/components/header-module";
import UiRoleList from "./ui/UiRoleList";

// hooks
import { useRoleList } from "./hooks/useRoleList";
import { useModulesWithPermissionsList } from "./hooks/useModulesWithPermissionsList";

export default function ModuleRole() {
  const { roles, refreshRoles, loading: loadingRoles, error: errorRoles } = useRoleList();
  const { modulesWithPermissions, refreshModulesWithPermissions, loading: loadingModulesWithPermissions, error: errorModulesWithPermissions } = useModulesWithPermissionsList();

  useEffect(() => {
    refreshRoles();
  }, []); 

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <HeaderModule
        title="Gestion de Roles"
        description="Administra los roles y permisos del sistema."
      />
      <UiRoleList 
        roles={roles}
        loadingRoles={loadingRoles}
        errorRoles={errorRoles}
        refreshRoles={refreshRoles}
        modulesWithPermissions={modulesWithPermissions}
        loadingModulesWithPermissions={loadingModulesWithPermissions}
        errorModulesWithPermissions={errorModulesWithPermissions}
        refreshModulesWithPermissions={refreshModulesWithPermissions}
      />
    </div>
  );
}