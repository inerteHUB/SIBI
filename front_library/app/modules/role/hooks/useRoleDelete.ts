"use client";

import { toast } from "sonner";
import { useState } from "react";
import { serviceRoleDelete } from "../services/serviceRoleDelete";

export const useRoleDelete = (refreshRoles: () => void) => {
    const [loading, setLoading] = useState(false);
    
    const deleteRole = async (id: number) => {
        setLoading(true);

        try {
            await serviceRoleDelete(id);
            refreshRoles();
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

    return { deleteRole, loading };
};
