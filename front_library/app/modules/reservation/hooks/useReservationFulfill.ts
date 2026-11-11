"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceReservationFulfill } from "../services/serviceReservationFulfill";
import { ReservationFulfillPayload } from "../type/typeReservationBase";

export const useReservationFulfill = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const processFulfill = async (reservationId: number, payload: ReservationFulfillPayload) => {
        setLoading(true);
        try {
            const res = await serviceReservationFulfill(reservationId, payload);
            toast.success(`Reserva ${res.code} completada con éxito`);
            onSuccess();
            return res;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al completar la reserva");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { processFulfill, loading };
};
