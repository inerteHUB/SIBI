import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Reservation, ReservationCreatePayload } from "../type/typeReservationBase";

export const serviceReservationCreate = async (payload: ReservationCreatePayload): Promise<Reservation> => {
    const res = await fetch(`${apiBackend}/v1/reservation/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    return handleApiResponse<Reservation>(res, "Error al registrar la reservación");
};
