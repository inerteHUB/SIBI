"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceDocumentTypeCreate } from "../services/serviceDocumentTypeCreate";

const SchemaDocumentType = z.object({
    name: z.string().min(2, "El nombre es requerido").max(200),
});

export type DocumentTypeCreateForm = z.infer<typeof SchemaDocumentType>;

export const useDocumentTypeCreate = (refreshLibraries: () => void) => {
    const [loading, setLoading] = useState(false);

    const formDocumentType = useForm<DocumentTypeCreateForm>({
        resolver: zodResolver(SchemaDocumentType),
        defaultValues: { name: "" },
    });

    const createDocumentType = async (data: DocumentTypeCreateForm) => {
        setLoading(true);
        try {
            await serviceDocumentTypeCreate(data);
            refreshLibraries();
            formDocumentType.reset();
            toast.success("Biblioteca registrada con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    return { formDocumentType, createDocumentType, loading };
};