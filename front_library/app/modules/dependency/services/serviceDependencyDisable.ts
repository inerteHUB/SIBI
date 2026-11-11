import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceDependencyDisable = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/dependency/${id}/disable`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al deshabilitar la Dependencia");
    }
    return true;
};