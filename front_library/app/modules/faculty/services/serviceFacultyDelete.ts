import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";

export const serviceFacultyDelete = async (id: number) => {
  const response = await fetch(`${apiBackend}/v1/faculty/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al eliminar la Facultad");
  }

  return true;
};
