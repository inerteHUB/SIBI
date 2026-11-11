"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceDependencyEnable } from "../services/serviceDependencyEnable";

export const useDependencyEnable = (refreshDependencies: () => void) => {
    const [loading, setLoading] = useState(false);

    const enableDependency = async (id: number) => {
        setLoading(true);
        try {
            await serviceDependencyEnable(id);
            refreshDependencies();
            toast.success("Registro habilitado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al habilitar");
        } finally {
            setLoading(false);
        }
    };

    return { enableDependency, loading };
};