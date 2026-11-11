import { useState } from "react";
import { SpecializationList } from "../type/typeSpecializationList";
import { serviceSpecializationList } from "../services/serviceSpecializationList";

export const useSpecializationList = () => {
    const [specializations, setSpecializations] = useState<SpecializationList[]>([]);
    const [loading, setLoading]                 = useState(false);
    const [error, setError]                     = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceSpecializationList();
            setSpecializations(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return { specializations, loading, error, refreshSpecializations: fetchData };
};