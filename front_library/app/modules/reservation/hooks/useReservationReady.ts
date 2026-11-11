"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceReservationReady } from "../services/serviceReservationReady";
import { ReservationReadyPayload } from "../type/typeReservationBase";

export const useReservationReady = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const processReady = async (reservationId: number, payload: ReservationReadyPayload) => {
        setLoading(true);
        try {
            const res = await serviceReservationReady(reservationId, payload);
            toast.success(`Reserva ${res.code} marcada como lista para retiro`);
            onSuccess();
            return res;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al preparar la reserva");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { processReady, loading };
};
