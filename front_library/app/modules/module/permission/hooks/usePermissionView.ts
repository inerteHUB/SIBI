// react
import { useState } from "react";

// componentes ui
import { toast } from "sonner";

// service
import { servicePermissionView } from "../services/servicePermissionView";

// tipado
import { PermissionView } from "../type/typePermissionView";

const permissionDefault = { id: 0, name: "" }

export const usePermissionView = () => {
    const [permission, setPermission] = useState<PermissionView>(permissionDefault);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPermission = async (id: number) => {
        setLoading(true);

        try {
            const data = await servicePermissionView(id);
            setPermission(data.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Error al obtener el permiso");
            }
        } finally {
            setLoading(false);
        }
    };

    return { permission, fetchPermission, loading };
};