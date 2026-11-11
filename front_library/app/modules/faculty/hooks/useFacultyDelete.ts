"use client";

import { toast } from "sonner";
import { useState } from "react";
import { serviceFacultyDelete } from "../services/serviceFacultyDelete";

export const useFacultyDelete = (refreshFaculties: () => void) => {
    const [loading, setLoading] = useState(false);
    
    const deleteFaculty = async (id: number) => {
        setLoading(true);

        try {
            await serviceFacultyDelete(id);
            refreshFaculties();
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

    return { deleteFaculty, loading };
};
