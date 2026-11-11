import { getAuthHeaders } from "@/lib/utils";
import { FacultyList } from "../type/typeFacultyList";
import { apiBackend } from "@/config/constants";

export const serviceFacultyList = async (): Promise<FacultyList[]> => {
    const res = await fetch(`${apiBackend}/v1/faculty`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar las facultades");
    return res.json();
};