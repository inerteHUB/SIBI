import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export interface DependencyFormItem {
    id: number;
    name: string;
}

export interface DependencyForm {
    faculties: DependencyFormItem[];
}

export const serviceDependencyForm = async (): Promise<DependencyForm> => {
    const res = await fetch(`${apiBackend}/v1/dependency/form`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los datos del formulario");
    return res.json();
};