import { apiBackend } from "@/config/constants";
import { getAuthHeadersMultipart } from "@/lib/utils";
import { UserEdit } from "../type/typeUserEdit";

export const serviceUserEdit = async (
    id: number,
    user: UserEdit,
    avatarFile?: File | null,
    removeAvatar?: boolean,
): Promise<void> => {
    const formData = new FormData();

    formData.append("faculty_id",       String(user.faculty_id));
    formData.append("username",         user.username);
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

    formData.append("remove_avatar", String(removeAvatar ?? false));
    if (avatarFile) formData.append("avatar", avatarFile);

    const response = await fetch(`${apiBackend}/v1/user/${id}`, {
        method: "PUT",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error al actualizar el Usuario");
    }
};