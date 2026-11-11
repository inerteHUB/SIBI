import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { DependencyByFaculty } from "../type/typeDependencyByFaculty";

export const serviceDependencyByFaculty = async (facultyId?: number): Promise<DependencyByFaculty[]> => {
    const res = await fetch(`${apiBackend}/v1/dependency/by-faculty/${facultyId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar las dependencias");
    return res.json();
};