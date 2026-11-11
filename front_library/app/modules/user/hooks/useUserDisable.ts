"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceUserDisable } from "../services/serviceUserDisable";

export const useUserDisable = (refreshUsers: () => void) => {
    const [loading, setLoading] = useState(false);

    const disableUser = async (id: number) => {
        setLoading(true);
        try {
            await serviceUserDisable(id);
            refreshUsers();
            toast.success("Usuario deshabilitado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al deshabilitar");
        } finally {
            setLoading(false);
        }
    };

    return { disableUser, loading };
};