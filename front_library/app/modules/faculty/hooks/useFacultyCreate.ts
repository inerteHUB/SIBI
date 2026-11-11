"use client";

import { toast } from "sonner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { serviceFacultyCreate } from "../services/serviceFacultyCreate";

const SchemaFaculty = z.object({
    name: z.string().min(2, { message: "El nombre es requerido" }).max(200),
    abbreviation: z.string().min(1, { message: "La abreviatura es requerida" }).max(20),
    logo: z
        .instanceof(File)
        .refine((f) => f.type === "image/png", { message: "Solo se permiten imágenes PNG" })
        .optional()
        .nullable(),
    stamp: z
        .instanceof(File)
        .refine((f) => f.type === "image/png", { message: "Solo se permiten imágenes PNG" })
        .optional()
        .nullable(),
});

export type FacultyCreateForm = z.infer<typeof SchemaFaculty>;

export const useFacultyCreate = (refreshFaculties: () => void) => {
    const [loading, setLoading] = useState(false);

    const formFaculty = useForm<FacultyCreateForm>({
        resolver: zodResolver(SchemaFaculty),
        defaultValues: { name: "", abbreviation: "", logo: null, stamp: null },
    });

    const createFaculty = async (data: FacultyCreateForm) => {
        setLoading(true);
        try {
            await serviceFacultyCreate(data, data.logo ?? null, data.stamp ?? null);
            refreshFaculties();
            formFaculty.reset();
            toast.success("Registro realizado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    return { formFaculty, createFaculty, loading };
};