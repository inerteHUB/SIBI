import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Reservation } from "../type/typeReservationBase";

export const serviceReservationMyActive = async (): Promise<Reservation[]> => {
    const url = `${apiBackend}/v1/reservation/my-reservations`;
    const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleApiResponse<Reservation[]>(res, "No se pudieron obtener tus reservaciones");
};
