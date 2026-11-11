"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceUserEnable } from "../services/serviceUserEnable";

export const useUserEnable = (refreshUsers: () => void) => {
    const [loading, setLoading] = useState(false);

    const enableUser = async (id: number) => {
        setLoading(true);
        try {
            await serviceUserEnable(id);
            refreshUsers();
            toast.success("Usuario habilitado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al habilitar");
        } finally {
            setLoading(false);
        }
    };

    return { enableUser, loading };
};