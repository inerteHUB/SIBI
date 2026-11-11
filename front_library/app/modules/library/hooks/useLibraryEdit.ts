"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceLibraryEdit } from "../services/serviceLibraryEdit";

const SchemaLibrary = z.object({
    name: z.string().min(2, "El nombre es requerido").max(200),
});

export type LibraryEditForm = z.infer<typeof SchemaLibrary>;

export const useLibraryEdit = (id: number, refreshLibraries: () => void) => {
    const [loading, setLoading] = useState(false);

    const formLibrary = useForm<LibraryEditForm>({
        resolver: zodResolver(SchemaLibrary),
        defaultValues: { name: "" },
    });

    const editLibrary = async (data: LibraryEditForm) => {
        setLoading(true);
        try {
            await serviceLibraryEdit(id, data);
            refreshLibraries();
            toast.success("Blibioteca actualizada con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return { formLibrary, editLibrary, loading };
};