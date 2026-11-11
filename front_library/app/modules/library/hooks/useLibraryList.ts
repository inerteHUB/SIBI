import { useState } from "react";
import { LibraryList } from "../type/typeLibraryList";
import { serviceLibraryList } from "../services/serviceLibraryList";

export const useLibraryList = () => {
    const [library, setLibraries] = useState<LibraryList[]>([]);
    const [loading, setLoading]                 = useState(false);
    const [error, setError]                     = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceLibraryList();
            setLibraries(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return { library, loading, error, refreshLibraries: fetchData };
};