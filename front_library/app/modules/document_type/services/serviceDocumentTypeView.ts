import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceDocumentTypeView = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/document_type/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al obtener el tipo de documento");
    }
    return await response.json();
};