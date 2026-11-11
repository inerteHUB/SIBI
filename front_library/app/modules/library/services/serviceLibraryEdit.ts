import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { LibraryEdit } from "../type/typeLibraryEdit";

export const serviceLibraryEdit = async (id: number, library: LibraryEdit): Promise<void> => {
    const response = await fetch(`${apiBackend}/v1/library/${id}`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(library),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al actualizar la Biblioteca");
    }
};