"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceUserDelete } from "../services/serviceUserDelete";

export const useUserDelete = (refreshUsers: () => void) => {
    const [loading, setLoading] = useState(false);

    const deleteUser = async (id: number) => {
        setLoading(true);
        try {
            await serviceUserDelete(id);
            refreshUsers();
            toast.success("Usuario eliminado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    return { deleteUser, loading };
};