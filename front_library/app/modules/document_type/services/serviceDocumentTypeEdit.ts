import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { DocumentTypeEdit } from "../type/typeDocumentTypeEdit";

export const serviceDocumentTypeEdit = async (id: number, documentType: DocumentTypeEdit): Promise<void> => {
    const response = await fetch(`${apiBackend}/v1/document_type/${id}`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(documentType),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al actualizar el tipo de documento");
    }
};