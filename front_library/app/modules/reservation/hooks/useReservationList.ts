"use client";

import { useState, useCallback } from "react";
import { Reservation, ReservationListParams } from "../type/typeReservationBase";
import { serviceReservationList } from "../services/serviceReservationList";

export const useReservationList = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = useCallback(async (params?: ReservationListParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceReservationList(params);
            setReservations(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar las reservaciones");
        } finally {
            setLoading(false);
        }
    }, []);

    return { reservations, setReservations, loading, error, refreshReservations: fetchReservations };
};
