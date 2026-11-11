import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { LibraryCreate } from "../type/typeLibraryCreate";

export const serviceLibraryCreate = async (library: LibraryCreate) => {
    const response = await fetch(`${apiBackend}/v1/library/`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(library),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar la Biblioteca");
    }
};