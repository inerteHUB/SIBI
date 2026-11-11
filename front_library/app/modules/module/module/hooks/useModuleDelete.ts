"use client";

import { toast } from "sonner";
import { useState } from "react";
import { serviceModuleDelete } from "../services/serviceModuleDelete";

export const useModuleDelete = (refreshModules: () => void) => {
    const [loading, setLoading] = useState(false);
    
    const deleteModule = async (id: number) => {
        setLoading(true);

        try {
            await serviceModuleDelete(id);
            refreshModules();
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

    return { deleteModule, loading };
};
