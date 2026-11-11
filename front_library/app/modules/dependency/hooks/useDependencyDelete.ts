"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceDependencyDelete } from "../services/serviceDependencyDelete";

export const useDependencyDelete = (refreshDependencies: () => void) => {
    const [loading, setLoading] = useState(false);

    const deleteDependency = async (id: number) => {
        setLoading(true);
        try {
            await serviceDependencyDelete(id);
            refreshDependencies();
            toast.success("Registro eliminado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    return { deleteDependency, loading };
};