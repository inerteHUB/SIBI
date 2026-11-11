// react
import { useState } from "react";

// componentes ui
import { toast } from "sonner";

// service
import { serviceFacultyView } from "../services/serviceFacultyView";

// tipado
import { FacultyView } from "../type/typeFacultyView";

export const useFacultyView = () => {
    const [faculty, setFaculty] = useState<FacultyView | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchFaculty = async (id: number) => {
        setLoading(true);

        try {
            const data = await serviceFacultyView(id);
            setFaculty(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Error al obtener la Facultad");
            }
        } finally {
            setLoading(false);
        }
    };

    return { faculty, fetchFaculty, loading };
};