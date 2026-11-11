import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { DocumentTypeList } from "../type/typeDocumentTypeList";

export const serviceDocumentTypeList = async (): Promise<DocumentTypeList[]> => {
    const res = await fetch(`${apiBackend}/v1/document_type/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los tipos de documentos");
    return res.json();
};