"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceDocumentTypeDelete } from "../services/serviceDocumentTypeDelete";

export const useDocumentTypeDelete = (refreshLibraries: () => void) => {
    const [loading, setLoading] = useState(false);

    const deleteDocumentType = async (id: number) => {
        setLoading(true);
        try {
            await serviceDocumentTypeDelete(id);
            refreshLibraries();
            toast.success("Tipo de documento eliminado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    return { deleteDocumentType, loading };
};