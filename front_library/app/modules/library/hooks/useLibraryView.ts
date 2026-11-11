import { useState } from "react";
import { toast } from "sonner";
import { serviceLibraryView } from "../services/serviceLibraryView";
import { LibraryView } from "../type/typeLibraryView";

export const useLibraryView = () => {
    const [library, setLibrary] = useState<LibraryView | null>(null);
    const [loading, setLoading]               = useState(false);

    const fetchLibrary = async (id: number) => {
        setLoading(true);
        try {
            const data = await serviceLibraryView(id);
            setLibrary(data);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al obtener la Biblioteca");
        } finally {
            setLoading(false);
        }
    };

    return { library, fetchLibrary, loading };
};