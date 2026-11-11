import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { DocumentTypeCreate } from "../type/typeDocumentTypeCreate";

export const serviceDocumentTypeCreate = async (documentType: DocumentTypeCreate) => {
    const response = await fetch(`${apiBackend}/v1/document_type/`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(documentType),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar el tipo de documento");
    }
};