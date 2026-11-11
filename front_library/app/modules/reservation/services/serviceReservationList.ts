import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Reservation, ReservationListParams } from "../type/typeReservationBase";

export const serviceReservationList = async (params?: ReservationListParams): Promise<Reservation[]> => {
    const query = new URLSearchParams();
    if (params?.userId) query.append("user_id", String(params.userId));
    if (params?.bookId) query.append("book_id", String(params.bookId));
    if (params?.status && params.status !== "TODOS") query.append("status", params.status);
    if (params?.facultyId) query.append("faculty_id", String(params.facultyId));
    if (params?.skip !== undefined) query.append("skip", String(params.skip));
    if (params?.limit !== undefined) query.append("limit", String(params.limit));

    const url = `${apiBackend}/v1/reservation/?${query.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleApiResponse<Reservation[]>(res, "No se pudieron cargar las reservaciones");
};
