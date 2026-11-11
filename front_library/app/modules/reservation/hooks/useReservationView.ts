"use client";

import { useState, useCallback } from "react";
import { Reservation } from "../type/typeReservationBase";
import { serviceReservationView } from "../services/serviceReservationView";

export const useReservationView = () => {
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservation = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceReservationView(id);
            setReservation(data);
            return data;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al obtener la reservación");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { reservation, setReservation, loading, error, fetchReservation };
};
