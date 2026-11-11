"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { serviceReservationCreate } from "../services/serviceReservationCreate";
import { ReservationCreatePayload } from "../type/typeReservationBase";

const SchemaReservationCreate = z.object({
    book_id: z.coerce.number().min(1, "Debe ingresar un ID de libro válido"),
    title: z.string().min(1, "El título de la obra es requerido"),
    target_user_id: z.string().optional(),
    observation: z.string().optional(),
});

export type ReservationCreateFormData = z.input<typeof SchemaReservationCreate>;

export const useReservationCreate = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const formReservation = useForm<ReservationCreateFormData>({
        resolver: zodResolver(SchemaReservationCreate),
        defaultValues: {
            book_id: "" as unknown as number,
            title: "",
            target_user_id: "",
            observation: "",
        },
    });

    const createReservation = async (data: ReservationCreateFormData) => {
        setLoading(true);
        try {
            const payload: ReservationCreatePayload = {
                book_id: Number(data.book_id),
                title: data.title ? String(data.title) : undefined,
                target_user_id: data.target_user_id ? Number(data.target_user_id) : undefined,
                observation: data.observation ? String(data.observation) : undefined,
            };
            const created = await serviceReservationCreate(payload);
            toast.success(`Reserva ${created.code} registrada exitosamente (Turno #${created.queue_position})`);
            formReservation.reset();
            onSuccess();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al registrar la reservación");
        } finally {
            setLoading(false);
        }
    };

    return { formReservation, createReservation, loading };
};
