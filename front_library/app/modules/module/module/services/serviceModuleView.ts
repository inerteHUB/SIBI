import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceModuleView = async (id: number) => {
  const response = await fetch(`${apiBackend}/v1/module/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al obtener el modulo");
  }

  return await response.json();
};
