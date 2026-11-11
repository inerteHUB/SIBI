import { getAuthHeaders } from "@/lib/utils";
import { RoleList } from "../type/typeRoleList";
import { apiBackend } from "@/config/constants";

export const serviceRoleList = async (): Promise<RoleList[]> => {
    const res = await fetch(`${apiBackend}/v1/role`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los roles");
    return res.json();
};