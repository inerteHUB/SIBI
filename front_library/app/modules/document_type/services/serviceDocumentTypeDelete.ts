import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceDocumentTypeDelete = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/document_type/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al eliminar el tip ode documento");
    }
    return true;
};