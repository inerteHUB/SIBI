import { useState } from "react";
import { DependencyForm } from "../type/typeDependencyForm";
import { serviceDependencyForm } from "../services/serviceDependencyForm";

export const useDependencyForm = () => {
    const [formData, setFormData] = useState<DependencyForm>({
        faculties: [],
    });
    const [loading, setLoading] = useState(false);

    const fetchFormData = async () => {
        setLoading(true);
        try {
            const data = await serviceDependencyForm();
            setFormData(data);
        } catch {
            // silencioso
        } finally {
            setLoading(false);
        }
    };

    return { formData, fetchFormData, loading };
};