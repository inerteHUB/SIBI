"use client";

import { toast } from "sonner";
import { useState } from "react";
import { servicePermissionDelete } from "../services/servicePermissionDelete";

export const usePermissionDelete = (refreshPermissions: () => void) => {
    const [loading, setLoading] = useState(false);
    
    const deletePermission = async (id: number) => {
        setLoading(true);

        try {
            await servicePermissionDelete(id);
            refreshPermissions();
            toast.success("Registro eliminado con exito");
        } catch (err: unknown) {
            if (err instanceof Error) {
              toast.error(err.message);
            } else {
              toast.error("Error al eliminar");
            }
          } finally {
            setLoading(false);
        }
    };

    return { deletePermission, loading };
};
