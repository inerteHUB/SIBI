import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { SystemData } from "./typeSystemData";

export const serviceSystemData = async (): Promise<SystemData> => {
    const response = await fetch(`${apiBackend}/v1/auth/system-data`, { 
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleApiResponse<SystemData>(response, "Error al obtener datos del sistema");
};
