import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { ModulePermissionsResult } from "./typeAuthPermissions";

export const serviceAuthPermissions = async (path: string): Promise<ModulePermissionsResult> => {
    const response = await fetch(`${apiBackend}/v1/auth/permissions?path=${encodeURIComponent(path)}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (response.status === 403) return { module_name: path, permissions: [] };

    return handleApiResponse<ModulePermissionsResult>(response, "Error al obtener los permisos del usuario");
};
