import { apiBackend } from "@/config/constants";
import { FacultyEdit } from "../type/typeFacultyEdit";
import { getAuthHeadersMultipart } from "@/lib/utils";

export const serviceFacultyEdit = async (
    id: number,
    faculty: FacultyEdit,
    logoFile?: File | null,
    removeLogo?: boolean,
    stampFile?: File | null,
    removeStamp?: boolean,
): Promise<void> => {
    const formData = new FormData();
    formData.append("name", faculty.name);
    formData.append("abbreviation", faculty.abbreviation);
    formData.append("remove_logo",  String(removeLogo  ?? false));
    formData.append("remove_stamp", String(removeStamp ?? false));
    if (logoFile)  formData.append("logo",  logoFile);
    if (stampFile) formData.append("stamp", stampFile);

    const response = await fetch(`${apiBackend}/v1/faculty/${id}`, {
        method: "PUT",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al actualizar la Facultad");
    }
};