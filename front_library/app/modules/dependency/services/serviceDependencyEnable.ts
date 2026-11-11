import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceDependencyEnable = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/dependency/${id}/enable`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al habilitar la Dependencia");
    }
    return true;
};