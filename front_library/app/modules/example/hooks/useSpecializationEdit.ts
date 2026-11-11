"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceSpecializationEdit } from "../services/serviceSpecializationEdit";

const SchemaSpecialization = z.object({
    name: z.string().min(2, "El nombre es requerido").max(200),
});

export type SpecializationEditForm = z.infer<typeof SchemaSpecialization>;

export const useSpecializationEdit = (id: number, refreshSpecializations: () => void) => {
    const [loading, setLoading] = useState(false);

    const formSpecialization = useForm<SpecializationEditForm>({
        resolver: zodResolver(SchemaSpecialization),
        defaultValues: { name: "" },
    });

    const editSpecialization = async (data: SpecializationEditForm) => {
        setLoading(true);
        try {
            await serviceSpecializationEdit(id, data);
            refreshSpecializations();
            toast.success("Especialización actualizada con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return { formSpecialization, editSpecialization, loading };
};