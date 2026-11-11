import { apiBackend } from "@/config/constants";
import { RoleEdit } from "../type/typeRoleEdit";
import { getAuthHeaders } from "@/lib/utils";

export const serviceRoleEdit = async (id: number, role: RoleEdit) => {
  const module_permission_ids = role.modules.flatMap((m) => m.permissionIds);

  const response = await fetch(`${apiBackend}/v1/role/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: role.name,
      description: role.description,
      module_permission_ids,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al actualizar el rol");
  }
};