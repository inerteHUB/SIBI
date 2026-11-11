import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceModuleAssignPermissions = async (id: number, permission_ids: number[]) => {
  const response = await fetch(`${apiBackend}/v1/module/assign-permissions/${id}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(permission_ids),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al asignar los permisos");
  }
};
