import { apiBackend } from "@/config/constants";
import { DependencyEdit } from "../type/typeDependencyEdit";
import { getAuthHeadersMultipart } from "@/lib/utils";

export const serviceDependencyEdit = async (
    id: number,
    dependency: DependencyEdit,
    logoFile?: File | null,
    removeLogo?: boolean,
    stampFile?: File | null,
    removeStamp?: boolean,
): Promise<void> => {
    const formData = new FormData();
    formData.append("name", dependency.name);
    formData.append("abbreviation", dependency.abbreviation);
    formData.append("faculty_id", String(dependency.faculty_id));
    formData.append("remove_logo",  String(removeLogo  ?? false));
    formData.append("remove_stamp", String(removeStamp ?? false));
    if (logoFile)  formData.append("logo",  logoFile);
    if (stampFile) formData.append("stamp", stampFile);

    const response = await fetch(`${apiBackend}/v1/dependency/${id}`, {
        method: "PUT",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al actualizar la Dependencia");
    }
};