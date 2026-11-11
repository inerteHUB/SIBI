import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { DependencyList } from "../type/typeDependencyList";

export const serviceDependencyList = async (facultyId?: number): Promise<DependencyList[]> => {
    const url = facultyId
        ? `${apiBackend}/v1/dependency/?faculty_id=${facultyId}`
        : `${apiBackend}/v1/dependency/`;

    const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar las dependencias");
    return res.json();
};