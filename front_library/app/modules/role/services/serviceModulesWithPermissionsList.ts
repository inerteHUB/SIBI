import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { ModulesWithPermissionsList } from "../type/typeModulesWithPermissionsList";

export const serviceModulesWithPermissionsList = async (): Promise<ModulesWithPermissionsList[]> => {
    const res = await fetch(`${apiBackend}/v1/role/modules-with-permissions`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los módulos con permisos");
    return res.json();
};