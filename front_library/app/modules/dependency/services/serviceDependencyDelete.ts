import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceDependencyDelete = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/dependency/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al eliminar la Dependencia");
    }
    return true;
};