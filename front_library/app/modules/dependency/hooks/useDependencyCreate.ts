"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceDependencyCreate } from "../services/serviceDependencyCreate";

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
});

export type DependencyCreateForm = z.infer<typeof SchemaDependency>;

export const useDependencyCreate = (refreshDependencies: () => void) => {
    const [loading, setLoading] = useState(false);

    const formDependency = useForm<DependencyCreateForm>({
        resolver: zodResolver(SchemaDependency),
        defaultValues: {
            name: "", abbreviation: "",
            faculty_id: 0,
            logo: null, stamp: null,
        },
    });

    const createDependency = async (data: DependencyCreateForm) => {
        setLoading(true);
        try {
            await serviceDependencyCreate(data, data.logo ?? null, data.stamp ?? null);
            refreshDependencies();
            formDependency.reset();
            toast.success("Registro realizado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    return { formDependency, createDependency, loading };
};