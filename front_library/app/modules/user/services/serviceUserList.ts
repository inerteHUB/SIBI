import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { UserList } from "../type/typeUserList";

export const serviceUserList = async (): Promise<UserList[]> => {
    const res = await fetch(`${apiBackend}/v1/user/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
    return res.json();
};