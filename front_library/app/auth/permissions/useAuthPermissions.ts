"use client";

import { useState } from "react";
import { serviceAuthPermissions } from "./serviceAuthPermissions";
import { toast } from "sonner";
import { ModulePermissionsResult } from "./typeAuthPermissions";

const moduleDefault = {
    module_name: "Desconocido",
    permissions: []
}

export function useAuthPermissions(path: string) {
    const [module, setModule] = useState<ModulePermissionsResult>(moduleDefault);
    const [loading, setLoading] = useState(true);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const data = await serviceAuthPermissions(path);
            setModule(data);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al obtener datos del sistema");
        } finally {
            setLoading(false);
        }
    };

    return { module, fetchPermissions, loading };
}
