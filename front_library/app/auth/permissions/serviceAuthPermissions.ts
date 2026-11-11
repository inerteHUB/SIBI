import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { AuthPermissions } from "./typeAuthPermissions";

export const serviceAuthPermissions = async (path: string): Promise<AuthPermissions> => {
    const response = await fetch(`${apiBackend}/v1/auth/permissions?path=${encodeURIComponent(path)}`, { 
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleApiResponse<AuthPermissions>(response, "Error al obtener los permisos del usuario");
};
