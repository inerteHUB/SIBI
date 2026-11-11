import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { SpecializationEdit } from "../type/typeSpecializationEdit";

export const serviceSpecializationEdit = async (id: number, specialization: SpecializationEdit): Promise<void> => {
    const response = await fetch(`${apiBackend}/v1/specialization/${id}`, {
        method: "PUT",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(specialization),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al actualizar la Especialización");
    }
};