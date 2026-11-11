import { useState } from "react";
import { UserForm } from "../type/typeUserForm";
import { serviceUserForm } from "../services/serviceUserForm";

export const useUserForm = () => {
    const [formData, setFormData] = useState<UserForm>({
        faculties: [],
        roles: [],
        specializations: [],
        dependencies:      [],
        jurado_role_names: [],
        autor_role_names:  [],
    });
    const [loading, setLoading] = useState(false);

    const fetchFormData = async () => {
        setLoading(true);
        try {
            const data = await serviceUserForm();
            setFormData(data);
        } catch {
            // silencioso, el padre maneja el error global
        } finally {
            setLoading(false);
        }
    };

    return { formData, fetchFormData, loading };
};