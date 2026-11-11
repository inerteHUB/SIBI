import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Reservation, ReservationCancelPayload } from "../type/typeReservationBase";

export const serviceReservationCancel = async (
    reservationId: number,
    payload: ReservationCancelPayload
): Promise<Reservation> => {
    const res = await fetch(`${apiBackend}/v1/reservation/${reservationId}/cancel`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    return handleApiResponse<Reservation>(res, "Error al cancelar la reservación");
};
