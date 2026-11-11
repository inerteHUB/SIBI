import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { LibraryList } from "../type/typeLibraryList";

export const serviceLibraryList = async (): Promise<LibraryList[]> => {
    const res = await fetch(`${apiBackend}/v1/library/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar las bibliotecas");
    return res.json();
};