import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { UserForm } from "../type/typeUserForm";

export const serviceUserForm = async (): Promise<UserForm> => {
    const res = await fetch(`${apiBackend}/v1/user/form`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("No se pudieron cargar los datos del formulario");
    return res.json();
};