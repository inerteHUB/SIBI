import { apiBackend } from "@/config/constants";
import { SearchResponse, ThesisPreDetailPublic } from "./typeLandingThesisPre";

export const serviceSearchThesisPre = async (
    q: string,
    page: number = 1,
    pageSize: number = 20,
): Promise<SearchResponse> => {
    const params = new URLSearchParams({
        q,
        page: String(page),
        page_size: String(pageSize),
    });

    const response = await fetch(`${apiBackend}/v1/landing/thesis-pre-search?${params.toString()}`, {
        method: "GET",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al buscar tesis");
    }
    return response.json();
};

export const serviceViewThesisPre = async (id: number): Promise<ThesisPreDetailPublic> => {
    const response = await fetch(`${apiBackend}/v1/landing/thesis-pre/${id}`, {
        method: "GET",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Tesis no encontrada");
    }
    return response.json();
};
