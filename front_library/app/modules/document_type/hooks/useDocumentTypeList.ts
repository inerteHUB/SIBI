import { useState } from "react";
import { DocumentTypeList } from "../type/typeDocumentTypeList";
import { serviceDocumentTypeList } from "../services/serviceDocumentTypeList";

export const useDocumentTypeList = () => {
    const [documentType, setDocumentTypes] = useState<DocumentTypeList[]>([]);
    const [loading, setLoading]                 = useState(false);
    const [error, setError]                     = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceDocumentTypeList();
            setDocumentTypes(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return { documentType, loading, error, refreshDocumentTypes: fetchData };
};