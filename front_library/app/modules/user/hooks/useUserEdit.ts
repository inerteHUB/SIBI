"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceUserEdit } from "../services/serviceUserEdit";
import { UserForm } from "../type/typeUserForm";

const ROLES_REQUIEREN_DEPENDENCIA = ["Autor (Pre)", "Autor (Pos)"];

const buildSchema = (formData: UserForm) =>
    z.object({
        faculty_id:         z.number({ invalid_type_error: "Seleccione una facultad" }).gt(0, "Seleccione una facultad"),
        dependency_id:      z.number().nullable().optional(),
        username:           z.string().min(3, "Mínimo 3 caracteres").max(100),
        name:               z.string().min(2, "El nombre es requerido").max(100),
        last_name:          z.string().nullable().optional(),
        paternal_surname:   z.string().min(2, "El apellido paterno es requerido").max(100),
        maternal_surname:   z.string().min(2, "El apellido materno es requerido").max(100),
        dni:                z.string().length(8, "El DNI debe tener 8 dígitos").regex(/^\d+$/, "Solo números"),
        email:              z.string().email("Email inválido").max(150),
        phone:              z.string().min(7, "Teléfono inválido").max(20),
        gender:             z.enum(["M", "F"], { message: "Seleccione un género" }),
        birthdate:          z.string().nullable().optional(),
        address:            z.string().nullable().optional(),
        role_ids:           z.array(z.number()).min(1, "Seleccione al menos un rol"),
        specialization_ids: z.array(z.number()),
        avatar: z
            .instanceof(File)
            .refine((f) => ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type), {
                message: "Solo PNG, JPG o WEBP",
            })
            .optional()
            .nullable(),
        remove_avatar: z.boolean(),
    }).superRefine((data, ctx) => {
        const selectedRoleNames = formData.roles
            .filter((r) => data.role_ids.includes(r.id))
            .map((r) => r.name);

        const requiereDependencia = selectedRoleNames.some((name) =>
            formData.autor_role_names.includes(name)
        );

        if (requiereDependencia && !data.dependency_id) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La escuela / dependencia es obligatoria para este rol",
                path: ["dependency_id"],
            });
        }
    });

export type UserEditForm = z.infer<ReturnType<typeof buildSchema>>;

export const useUserEdit = (id: number, refreshUsers: () => void, formData: UserForm) => {
    const [loading, setLoading] = useState(false);

    const formUser = useForm<UserEditForm>({
        resolver: zodResolver(buildSchema(formData)),
        defaultValues: {
            faculty_id: 0,         dependency_id: null,
            username: "",
            name: "",              last_name: null,
            paternal_surname: "",  maternal_surname: "",
            dni: "",               email: "",
            phone: "",             gender: "M",
            birthdate: null,       address: null,
            role_ids: [],          specialization_ids: [],
            avatar: null,          remove_avatar: false,
        },
    });

    const editUser = async (data: UserEditForm) => {
        setLoading(true);
        try {
            await serviceUserEdit(
                id,
                {
                    ...data,
                    last_name:          data.last_name  ?? null,
                    birthdate:          data.birthdate  ?? null,
                    address:            data.address    ?? null,
                    dependency_id:      data.dependency_id ?? null,
                    specialization_ids: data.specialization_ids ?? [],
                },
                data.avatar ?? null,
                data.remove_avatar,
            );
            refreshUsers();
            toast.success("Usuario actualizado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return { formUser, editUser, loading };
};