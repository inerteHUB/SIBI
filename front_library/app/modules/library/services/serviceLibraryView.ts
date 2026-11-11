import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceLibraryView = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/library/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al obtener la Biblioteca");
    }
    return await response.json();
};