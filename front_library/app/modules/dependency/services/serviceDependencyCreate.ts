import { apiBackend } from "@/config/constants";
import { DependencyCreate } from "../type/typeDependencyCreate";
import { getAuthHeadersMultipart } from "@/lib/utils";

export const serviceDependencyCreate = async (
    dependency: DependencyCreate,
    logoFile?: File | null,
    stampFile?: File | null,
) => {
    const formData = new FormData();
    formData.append("name", dependency.name);
    formData.append("abbreviation", dependency.abbreviation);
    formData.append("faculty_id", String(dependency.faculty_id));
    if (logoFile)  formData.append("logo",  logoFile);
    if (stampFile) formData.append("stamp", stampFile);

    const response = await fetch(`${apiBackend}/v1/dependency/`, {
        method: "POST",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar la Dependencia");
    }
};