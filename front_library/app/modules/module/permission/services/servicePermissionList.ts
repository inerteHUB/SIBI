import { getAuthHeaders } from "@/lib/utils";
import { PermissionList } from "../type/typePermissionList";
import { apiBackend } from "@/config/constants";

export const servicePermissionList = async (): Promise<PermissionList[]> => {
    const res = await fetch(`${apiBackend}/v1/permission`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los permisos");
    return res.json();
};