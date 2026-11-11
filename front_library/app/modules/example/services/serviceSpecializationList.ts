import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { SpecializationList } from "../type/typeSpecializationList";

export const serviceSpecializationList = async (): Promise<SpecializationList[]> => {
    const res = await fetch(`${apiBackend}/v1/specialization/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar las especializaciones");
    return res.json();
};