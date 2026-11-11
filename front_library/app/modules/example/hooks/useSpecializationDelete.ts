"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceSpecializationDelete } from "../services/serviceSpecializationDelete";

export const useSpecializationDelete = (refreshSpecializations: () => void) => {
    const [loading, setLoading] = useState(false);

    const deleteSpecialization = async (id: number) => {
        setLoading(true);
        try {
            await serviceSpecializationDelete(id);
            refreshSpecializations();
            toast.success("Especialización eliminada con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    return { deleteSpecialization, loading };
};