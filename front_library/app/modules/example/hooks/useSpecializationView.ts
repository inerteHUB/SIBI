import { useState } from "react";
import { toast } from "sonner";
import { serviceSpecializationView } from "../services/serviceSpecializationView";
import { SpecializationView } from "../type/typeSpecializationView";

export const useSpecializationView = () => {
    const [specialization, setSpecialization] = useState<SpecializationView | null>(null);
    const [loading, setLoading]               = useState(false);

    const fetchSpecialization = async (id: number) => {
        setLoading(true);
        try {
            const data = await serviceSpecializationView(id);
            setSpecialization(data);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al obtener la Especialización");
        } finally {
            setLoading(false);
        }
    };

    return { specialization, fetchSpecialization, loading };
};