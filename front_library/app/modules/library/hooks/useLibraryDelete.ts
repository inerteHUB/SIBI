"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceLibraryDelete } from "../services/serviceLibraryDelete";

export const useLibraryDelete = (refreshLibraries: () => void) => {
    const [loading, setLoading] = useState(false);

    const deleteLibrary = async (id: number) => {
        setLoading(true);
        try {
            await serviceLibraryDelete(id);
            refreshLibraries();
            toast.success("Biblioteca eliminada con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    return { deleteLibrary, loading };
};