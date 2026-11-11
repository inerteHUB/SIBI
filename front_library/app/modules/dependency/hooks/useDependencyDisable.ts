"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceDependencyDisable } from "../services/serviceDependencyDisable";

export const useDependencyDisable = (refreshDependencies: () => void) => {
    const [loading, setLoading] = useState(false);

    const disableDependency = async (id: number) => {
        setLoading(true);
        try {
            await serviceDependencyDisable(id);
            refreshDependencies();
            toast.success("Registro deshabilitado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al deshabilitar");
        } finally {
            setLoading(false);
        }
    };

    return { disableDependency, loading };
};