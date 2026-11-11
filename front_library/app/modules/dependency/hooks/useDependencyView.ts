import { useState } from "react";
import { toast } from "sonner";
import { serviceDependencyView } from "../services/serviceDependencyView";
import { DependencyView } from "../type/typeDependencyView";

export const useDependencyView = () => {
    const [dependency, setDependency] = useState<DependencyView | null>(null);
    const [loading, setLoading]       = useState<boolean>(false);

    const fetchDependency = async (id: number) => {
        setLoading(true);
        try {
            const data = await serviceDependencyView(id);
            setDependency(data);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al obtener la Dependencia");
        } finally {
            setLoading(false);
        }
    };

    return { dependency, fetchDependency, loading };
};