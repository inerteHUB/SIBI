"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceLibraryCreate } from "../services/serviceLibraryCreate";

const SchemaLibrary = z.object({
    name: z.string().min(2, "El nombre es requerido").max(200),
});

export type LibraryCreateForm = z.infer<typeof SchemaLibrary>;

export const useLibraryCreate = (refreshLibraries: () => void) => {
    const [loading, setLoading] = useState(false);

    const formLibrary = useForm<LibraryCreateForm>({
        resolver: zodResolver(SchemaLibrary),
        defaultValues: { name: "" },
    });

    const createLibrary = async (data: LibraryCreateForm) => {
        setLoading(true);
        try {
            await serviceLibraryCreate(data);
            refreshLibraries();
            formLibrary.reset();
            toast.success("Biblioteca registrada con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    return { formLibrary, createLibrary, loading };
};