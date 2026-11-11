import { apiBackend } from "@/config/constants";
import { ModuleEdit } from "../type/typeModuleEdit";
import { getAuthHeadersMultipart } from "@/lib/utils";

export const serviceModuleEdit = async (id: number, module: ModuleEdit) => {
  const formData = new FormData();

  formData.append("name", module.name);
  formData.append("is_parent", String(module.is_parent));
  formData.append("path", module.is_parent == false ? module.path ?? "" : "");
  formData.append("parent_id", module.parent_id ? String(module.parent_id) : "");
  formData.append("remove_icon", String(module.remove_icon));

  if (module.icon) {
    formData.append("icon", module.icon);
  }

  const response = await fetch(`${apiBackend}/v1/module/${id}`, {
    method: "PUT",
    headers: getAuthHeadersMultipart(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al actualizar el módulo");
  }
};
