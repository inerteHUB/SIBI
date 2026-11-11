import { apiBackend } from "@/config/constants";
import { PermissionEdit } from "../type/typePermissionEdit";
import { getAuthHeaders } from "@/lib/utils";

export const servicePermissionEdit = async (id: number, data: PermissionEdit): Promise<void> => {
  const response = await fetch(`${apiBackend}/v1/permission/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al actualizar el permiso");
  }
};
