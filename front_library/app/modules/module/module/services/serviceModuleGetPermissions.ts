import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceModuleGetPermissions = async (id: number) => {
  const response = await fetch(`${apiBackend}/v1/module/get-permissions/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener los permisos del módulo");
  }

  return await response.json();
};
