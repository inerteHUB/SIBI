import { apiBackend } from "@/config/constants";
import { RoleCreate } from "../type/typeRoleCreate";
import { getAuthHeaders } from "@/lib/utils";

export const serviceRoleCreate = async (role: RoleCreate) => {
  const module_permission_ids = role.modules.flatMap((m) => m.permissionIds);

  const response = await fetch(`${apiBackend}/v1/role`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: role.name,
      description: role.description,
      module_permission_ids,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al registrar el rol");
  }
};