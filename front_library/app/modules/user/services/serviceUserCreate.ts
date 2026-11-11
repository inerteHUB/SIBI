import { apiBackend } from "@/config/constants";
import { getAuthHeadersMultipart } from "@/lib/utils";
import { UserCreate } from "../type/typeUserCreate";

export const serviceUserCreate = async (user: UserCreate, avatarFile?: File | null) => {
    const formData = new FormData();

    formData.append("faculty_id",       String(user.faculty_id));
    formData.append("username",         user.username);
    formData.append("password",         user.password);
    formData.append("name",             user.name);
    if (user.last_name) formData.append("last_name", user.last_name);
    formData.append("paternal_surname", user.paternal_surname);
    formData.append("maternal_surname", user.maternal_surname);
    formData.append("dni",              user.dni);
    formData.append("email",            user.email);
    formData.append("phone",            user.phone);
    formData.append("gender",           user.gender);
    if (user.dependency_id) formData.append("dependency_id", String(user.dependency_id));
    if (user.birthdate) formData.append("birthdate", user.birthdate);
    if (user.address) formData.append("address",   user.address);

    user.role_ids.forEach((id) => formData.append("role_ids", String(id)));
    user.specialization_ids.forEach((id) => formData.append("specialization_ids", String(id)));

    if (avatarFile) formData.append("avatar", avatarFile);

    const response = await fetch(`${apiBackend}/v1/user/`, {
        method: "POST",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al registrar el Usuario");
    }
};