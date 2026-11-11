"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceDependencyEdit } from "../services/serviceDependencyEdit";

const SchemaDependency = z.object({
    name: z.string().min(2, { message: "El nombre es requerido" }).max(200),
    abbreviation: z.string().min(1, { message: "La abreviatura es requerida" }).max(20),
    faculty_id: z.number({ invalid_type_error: "Seleccione una facultad" }).gt(0, { message: "Seleccione una facultad" }),
    logo: z
        .instanceof(File)
        .refine((f) => f.type === "image/png", { message: "Solo se permiten imágenes PNG" })
        .optional().nullable(),
    stamp: z
        .instanceof(File)
        .refine((f) => f.type === "image/png", { message: "Solo se permiten imágenes PNG" })
        .optional().nullable(),
    remove_logo:  z.boolean(),
    remove_stamp: z.boolean(),
});

export type DependencyEditForm = z.infer<typeof SchemaDependency>;

export const useDependencyEdit = (id: number, refreshDependencies: () => void) => {
    const [loading, setLoading] = useState(false);

    const formDependency = useForm<DependencyEditForm>({
        resolver: zodResolver(SchemaDependency),
        defaultValues: {
            name: "", abbreviation: "",
            faculty_id: 0,
            logo: null, stamp: null,
            remove_logo: false, remove_stamp: false,
        },
    });

    const editDependency = async (data: DependencyEditForm) => {
        setLoading(true);
        try {
            await serviceDependencyEdit(
                id, data,
                data.logo  ?? null, data.remove_logo,
                data.stamp ?? null, data.remove_stamp,
            );
            refreshDependencies();
            toast.success("Registro actualizado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return { formDependency, editDependency, loading };
};