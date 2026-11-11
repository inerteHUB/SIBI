import { useState } from "react";
import { toast } from "sonner";
import { serviceDocumentTypeView } from "../services/serviceDocumentTypeView";
import { DocumentTypeView } from "../type/typeDocumentTypeView";

export const useDocumentTypeView = () => {
    const [documentType, setDocumentType] = useState<DocumentTypeView | null>(null);
    const [loading, setLoading]               = useState(false);

    const fetchDocumentType = async (id: number) => {
        setLoading(true);
        try {
            const data = await serviceDocumentTypeView(id);
            setDocumentType(data);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al obtener el tipo de documento");
        } finally {
            setLoading(false);
        }
    };

    return { documentType, fetchDocumentType, loading };
};