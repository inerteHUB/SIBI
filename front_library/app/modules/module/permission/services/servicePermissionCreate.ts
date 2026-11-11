import { apiBackend } from "@/config/constants";
import { PermissionCreate } from "../type/typePermissionCreate";
import { getAuthHeaders } from "@/lib/utils";

export const servicePermissionCreate = async (permission: PermissionCreate) => {
  const response = await fetch(`${apiBackend}/v1/permission`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(permission),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al registrar el permiso");
  }
};