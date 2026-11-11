import { apiBackend } from "@/config/constants";
import { FacultyCreate } from "../type/typeFacultyCreate";
import { getAuthHeadersMultipart } from "@/lib/utils";

export const serviceFacultyCreate = async (
    faculty: FacultyCreate,
    logoFile?: File | null,
    stampFile?: File | null,
) => {
    const formData = new FormData();
    formData.append("name", faculty.name);
    formData.append("abbreviation", faculty.abbreviation);
    if (logoFile)  formData.append("logo", logoFile);
    if (stampFile) formData.append("stamp", stampFile);

    const response = await fetch(`${apiBackend}/v1/faculty/`, {
        method: "POST",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar la Facultad");
    }
};