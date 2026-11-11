import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceUserEnable = async (id: number) => {
    const response = await fetch(`${apiBackend}/v1/user/${id}/enable`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al habilitar el Usuario");
    }
    return true;
};