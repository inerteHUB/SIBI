import { useState } from "react";
import { DependencyList } from "../type/typeDependencyList";
import { serviceDependencyList } from "../services/serviceDependencyList";

export const useDependencyList = () => {
    const [Dependencies, setDependencies] = useState<DependencyList[]>([]);
    const [loading, setLoading]           = useState<boolean>(false);
    const [error, setError]               = useState<string | null>(null);

    const fetchData = async (facultyId?: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceDependencyList(facultyId);
            setDependencies(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return { Dependencies, setDependencies, loading, error, refreshDependencies: fetchData };
};