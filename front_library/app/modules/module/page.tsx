"use client"

// react
import { useEffect } from "react";

// componentes
import HeaderModule from "@/components/header-module";
import UiPermissionMain from "./permission/ui/UiPermissionMain";
import UiModuleCreate from "./module/ui/UiModuleCreate";
import UiModuleList from "./module/ui/UiModuleList";

// hooks
import { usePermissionList } from "./permission/hooks/usePermissionList";
import { useModuleList } from "./module/hooks/useModuleList";

export default function ModuleModule() {
  const { permissions, loading: loadingPermissions, error: errorPermissions, refreshPermissions } = usePermissionList();
  const { modules, refreshModules, loading: loadingModules, error: errorModules } = useModuleList();

  useEffect(() => {
    refreshModules();
    refreshPermissions();
  }, []); 

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <HeaderModule
        title="Gestion de modulos"
        description="Administra los modulos, permisos y estructura del sistema."
      />
      <div className="flex flex-wrap gap-4">
        <UiModuleCreate
          modules={modules}
          loadingModules={loadingModules}
          errorModules={errorModules}
          refreshModules={refreshModules}
        />
        <UiPermissionMain
          permissions={permissions}
          loading={loadingPermissions}
          error={errorPermissions}
          refreshPermissions={refreshPermissions}
        />
      </div>
      <UiModuleList
        modules={modules}
        loadingModules={loadingModules}
        errorModules={errorModules}
        refreshModules={refreshModules}
        permissions={permissions}
        loadingPermissions={loadingPermissions}
        errorPermissions={errorPermissions}
        refreshPermissions={refreshPermissions}
      />
    </div>
  );
}