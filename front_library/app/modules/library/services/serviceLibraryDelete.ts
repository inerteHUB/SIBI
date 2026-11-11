import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceLibraryDelete = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/library/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al eliminar la Biblioteca");
    }
    return true;
};