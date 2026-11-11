"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { serviceLoanCreate } from "../services/serviceLoanCreate";
import { LoanCreatePayload } from "../type/typeLoanBase";

const SchemaItem = z.object({
    copy_id: z.coerce.number().min(1, "El ID del ejemplar es requerido"),
    copy_code: z.string().optional(),
    title: z.string().min(1, "El título del libro es requerido"),
    initial_condition: z.string().min(1),
    notes: z.string().optional(),
});

const SchemaLoanCreate = z.object({
    user_id: z.coerce.number().min(1, "Debe seleccionar un usuario prestatario"),
    loan_type: z.enum(["Sala", "Domicilio"]),
    days: z.coerce.number().min(1, "Ingrese un plazo válido"),
    observation: z.string().optional(),
    details: z.array(SchemaItem).min(1, "Debe agregar al menos un ejemplar"),
});

export type LoanCreateFormData = z.infer<typeof SchemaLoanCreate>;

export const useLoanCreate = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const formLoan = useForm<LoanCreateFormData>({
        resolver: zodResolver(SchemaLoanCreate),
        defaultValues: {
            user_id: "" as unknown as number,
            loan_type: "Domicilio",
            days: "" as unknown as number,
            observation: "",
            details: [
                {
                    copy_id: "" as unknown as number,
                    copy_code: "",
                    title: "",
                    initial_condition: "",
                    notes: "",
                },
            ],
        },
    });

    const fieldArray = useFieldArray({
        control: formLoan.control,
        name: "details",
    });

    const createLoan = async (data: LoanCreateFormData) => {
        setLoading(true);
        try {
            await serviceLoanCreate(data as unknown as LoanCreatePayload);
            toast.success("Préstamo registrado exitosamente");
            formLoan.reset();
            onSuccess();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al registrar el préstamo");
        } finally {
            setLoading(false);
        }
    };

    return { formLoan, fieldArray, createLoan, loading };
};
