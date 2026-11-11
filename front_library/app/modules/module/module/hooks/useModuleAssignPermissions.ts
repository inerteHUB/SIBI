"use client";

// componentes ui
import { toast } from "sonner";

// react
import { useState } from "react";

// service
import { serviceModuleAssignPermissions } from "../services/serviceModuleAssignPermissions";

export const useModuleAssignPermissions = (moduleId: number) => {
  const [loading, setLoading] = useState(false);

  const assignPermissions = async (permissionIds: number[]) => {
    setLoading(true);

    try {
      await serviceModuleAssignPermissions(moduleId, permissionIds);
      toast.success("Permisos asignados con éxito");
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error al registrar");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { assignPermissions, loading };
};