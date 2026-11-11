"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceDocumentTypeEdit } from "../services/serviceDocumentTypeEdit";

const SchemaDocumentType = z.object({
    name: z.string().min(2, "El nombre es requerido").max(200),
});

export type DocumentTypeEditForm = z.infer<typeof SchemaDocumentType>;

export const useDocumentTypeEdit = (id: number, refreshLibraries: () => void) => {
    const [loading, setLoading] = useState(false);

    const formDocumentType = useForm<DocumentTypeEditForm>({
        resolver: zodResolver(SchemaDocumentType),
        defaultValues: { name: "" },
    });

    const editDocumentType = async (data: DocumentTypeEditForm) => {
        setLoading(true);
        try {
            await serviceDocumentTypeEdit(id, data);
            refreshLibraries();
            toast.success("Tipo de documento actualizado con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return { formDocumentType, editDocumentType, loading };
};