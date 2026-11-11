"use client";

import { useEffect } from "react";
import HeaderModule from "@/components/header-module";
import UiReservationList from "./ui/UiReservationList";
import { useReservationList } from "./hooks/useReservationList";

export default function ModuleReservation() {
    const {
        reservations,
        refreshReservations,
        loading: loadingReservations,
        error: errorReservations,
    } = useReservationList();

    useEffect(() => {
        refreshReservations();
    }, [refreshReservations]);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestión de Reservas y Cola de Espera"
                description="Administración de reservas de material bibliográfico, asignación de turnos, preparación de ejemplares para recojo y formalización de entregas."
            />
            <UiReservationList
                reservations={reservations}
                loadingReservations={loadingReservations}
                errorReservations={errorReservations}
                refreshReservations={refreshReservations}
            />
        </div>
    );
}
