import { useState } from "react";
import { DependencyByFaculty } from "../type/typeDependencyByFaculty";
import { serviceDependencyByFaculty } from "../services/serviceDependencyByFaculty";

export const useDependencyByFaculty = () => {
    const [dependenciesByFaculty, setDependenciesByFaculty] = useState<DependencyByFaculty[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (facultyId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceDependencyByFaculty(facultyId);
            setDependenciesByFaculty(data);
        } catch (err) {
            setError(String(err));
            setDependenciesByFaculty([]);
        } finally {
            setLoading(false);
        }
    };

    const clearDependencies = () => setDependenciesByFaculty([]);

    return { 
        dependenciesByFaculty, 
        setDependenciesByFaculty, 
        loading, 
        error, 
        clearDependencies,
        refreshDependenciesByFaculty: fetchData };
};