import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Reservation, ReservationFulfillPayload } from "../type/typeReservationBase";

export const serviceReservationFulfill = async (
    reservationId: number,
    payload: ReservationFulfillPayload
): Promise<Reservation> => {
    const res = await fetch(`${apiBackend}/v1/reservation/${reservationId}/fulfill`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    return handleApiResponse<Reservation>(res, "Error al completar la reservación");
};
