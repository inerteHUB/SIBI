import { getAuthHeaders } from "@/lib/utils";
import { ModuleList } from "../type/typeModuleList";
import { apiBackend } from "@/config/constants";

export const serviceModuleList = async (): Promise<ModuleList[]> => {
    const res = await fetch(`${apiBackend}/v1/module`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los modulos");
    return res.json();
};