import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { SpecializationCreate } from "../type/typeSpecializationCreate";

export const serviceSpecializationCreate = async (specialization: SpecializationCreate) => {
    const response = await fetch(`${apiBackend}/v1/specialization/`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(specialization),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar la Especialización");
    }
};