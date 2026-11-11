// react
import { useState } from "react";

// componentes ui
import { toast } from "sonner";

// service
import { serviceModuleGetPermissions } from "../services/serviceModuleGetPermissions";

// tipado
import { ModuleGetPermissions } from "../type/typeModuleGetPermissions";

const getPermissionsDefault: ModuleGetPermissions = { permission_ids: [] };

export const useModuleGetPermissions = () => {
    const [getPermissions, setGetPermissions] = useState<ModuleGetPermissions>(getPermissionsDefault);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchGetPermissions = async (id: number) => {
        setLoading(true);

        try {
            const data = await serviceModuleGetPermissions(id);
            setGetPermissions(data);
            return data;
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Error al obtener los permisos del módulo");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getPermissions, fetchGetPermissions, loading };
};