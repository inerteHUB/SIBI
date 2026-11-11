import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const servicePermissionView = async (id: number) => {
  const response = await fetch(`${apiBackend}/v1/permission/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener el permiso");
  }

  return await response.json();
};
