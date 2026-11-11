import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceUserChangePassword = async (
    id: number,
    newPassword: string,
    currentPassword?: string,
) => {
    const response = await fetch(`${apiBackend}/v1/user/${id}/change-password`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
            current_password: currentPassword ?? null,
            new_password: newPassword,
        }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al cambiar la contraseña");
    }
    return true;
};