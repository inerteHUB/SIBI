import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Reservation } from "../type/typeReservationBase";

export const serviceReservationView = async (reservationId: number): Promise<Reservation> => {
    const res = await fetch(`${apiBackend}/v1/reservation/${reservationId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleApiResponse<Reservation>(res, "No se pudo obtener el detalle de la reservación");
};
