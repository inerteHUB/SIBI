"use client";

// componentes ui
import { toast } from "sonner";

// react
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// service
import { serviceRoleCreate } from "../services/serviceRoleCreate";

// tipado
import { RoleCreate } from "../type/typeRoleCreate";

// esquema para SelectedModule
const SelectedModuleSchema = z.object({
    moduleId: z.number(),
    permissionIds: z.array(z.number()).min(1, { message: "Debe seleccionar al menos un permiso para este módulo." }),
});

export const SchemaRole = z.object({
    name: z.string().min(1, {
        message: "El nombre es obligatorio.",
    }).min(3, {
        message: "El nombre debe tener al menos 3 caracteres.",
    }),
    description: z.string().min(1, {
        message: "La descripcion es obligatoria.",
    }).min(10, {
        message: "La descripcion debe tener al menos 10 caracteres.",
    }),
    // Valida que 'modules' sea un array de SelectedModuleSchema
    // y que haya al menos un módulo con permisos seleccionados.
    modules: z.array(SelectedModuleSchema)
        .min(1, { message: "Debe asignar permisos a al menos un modulo." })
        .refine(
            (modules) => modules.some((mod) => mod.permissionIds.length > 0),
            {
                message: "Debe seleccionar al menos un permiso en al menos un modulo.",
            }
        ),
});

export const useRoleCreate = (refreshRoles: () => void, setOpen: (open: boolean) => void) => {
    const [loading, setLoading] = useState(false);

    type RoleFormValues = z.infer<typeof SchemaRole>;

    const formRole = useForm<RoleFormValues>({
        resolver: zodResolver(SchemaRole),
        defaultValues: {
            name: "",
            description: "",
            modules: [],
        },
    });

    const createRole = async (data: RoleCreate) => {
        setLoading(true);

        try {
            await serviceRoleCreate(data);
            refreshRoles();
            formRole.reset();
            toast.success("Registro realizado con exito");
            setOpen(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Error al registrar");
            }
        } finally {
            setLoading(false);
        }
    };

    return { formRole, createRole, loading };
};