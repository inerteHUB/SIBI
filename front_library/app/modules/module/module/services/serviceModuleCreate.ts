import { apiBackend } from "@/config/constants";
import { ModuleCreate } from "../type/typeModuleCreate";
import { getAuthHeadersMultipart } from "@/lib/utils";

export const serviceModuleCreate = async (module: ModuleCreate) => {
  const formData = new FormData();

  formData.append("name", module.name);
  formData.append("is_parent", String(module.is_parent));
  formData.append("path", module.is_parent == false ? module.path ?? "" : "");
  formData.append("parent_id", module.parent_id ? String(module.parent_id) : "");

  if (module.icon) {
    formData.append("icon", module.icon);
  }

  const response = await fetch(`${apiBackend}/v1/module`, {
    method: "POST",
    headers: getAuthHeadersMultipart(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al registrar el modulo");
  }
};
