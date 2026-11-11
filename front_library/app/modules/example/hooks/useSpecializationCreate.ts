"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceSpecializationCreate } from "../services/serviceSpecializationCreate";

const SchemaSpecialization = z.object({
    name: z.string().min(2, "El nombre es requerido").max(200),
});

export type SpecializationCreateForm = z.infer<typeof SchemaSpecialization>;

export const useSpecializationCreate = (refreshSpecializations: () => void) => {
    const [loading, setLoading] = useState(false);

    const formSpecialization = useForm<SpecializationCreateForm>({
        resolver: zodResolver(SchemaSpecialization),
        defaultValues: { name: "" },
    });

    const createSpecialization = async (data: SpecializationCreateForm) => {
        setLoading(true);
        try {
            await serviceSpecializationCreate(data);
            refreshSpecializations();
            formSpecialization.reset();
            toast.success("Especialización registrada con éxito");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    return { formSpecialization, createSpecialization, loading };
};