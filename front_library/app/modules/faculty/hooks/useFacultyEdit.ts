"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceFacultyEdit } from "../services/serviceFacultyEdit";

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
    remove_logo:  z.boolean(),
    remove_stamp: z.boolean(),
});

export type FacultyEditForm = z.infer<typeof SchemaFaculty>;

export const useFacultyEdit = (id: number, refreshFaculties: () => void) => {
    const [loading, setLoading] = useState(false);

    const formFaculty = useForm<FacultyEditForm>({
        resolver: zodResolver(SchemaFaculty),
        defaultValues: {
            name: "", abbreviation: "",
            logo: null, stamp: null,
            remove_logo: false, remove_stamp: false,
        },
    });

    const editFaculty = async (data: FacultyEditForm) => {
        setLoading(true);
        try {
            await serviceFacultyEdit(
                id, data,
                data.logo  ?? null, data.remove_logo,
                data.stamp ?? null, data.remove_stamp,
            );
            refreshFaculties();
            toast.success("Registro actualizado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return { formFaculty, editFaculty, loading };
};