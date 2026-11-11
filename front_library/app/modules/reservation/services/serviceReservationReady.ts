import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Reservation, ReservationReadyPayload } from "../type/typeReservationBase";

export const serviceReservationReady = async (
    reservationId: number,
    payload: ReservationReadyPayload
): Promise<Reservation> => {
    const res = await fetch(`${apiBackend}/v1/reservation/${reservationId}/ready`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    return handleApiResponse<Reservation>(res, "Error al preparar la reserva para recojo");
};
