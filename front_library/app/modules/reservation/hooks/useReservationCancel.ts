"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceReservationCancel } from "../services/serviceReservationCancel";
import { ReservationCancelPayload } from "../type/typeReservationBase";

export const useReservationCancel = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const processCancel = async (reservationId: number, payload: ReservationCancelPayload) => {
        setLoading(true);
        try {
            const res = await serviceReservationCancel(reservationId, payload);
            toast.success(`Reserva ${res.code} cancelada exitosamente`);
            onSuccess();
            return res;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al cancelar la reservación");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { processCancel, loading };
};
