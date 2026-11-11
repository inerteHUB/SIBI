export interface ReservationUserInfo {
    id: number;
    username: string;
    full_name: string;
    dni: string;
    email: string;
}

export interface ReservationLoanInfo {
    id: number;
    code: string;
    status: string;
}

export interface Reservation {
    id: number;
    code: string;
    user_id: number;
    faculty_id?: number;
    book_id: number;
    title?: string;
    copy_id?: number;
    reservation_date: string;
    expiration_date?: string;
    status: "Pendiente" | "Lista_Para_Recojo" | "Completada" | "Cancelada" | "Expirada" | string;
    queue_position: number;
    loan_id?: number;
    observation?: string;
    is_expired: boolean;
    hours_left_to_pickup?: number;
    user?: ReservationUserInfo;
    loan?: ReservationLoanInfo;
}

export interface ReservationCreatePayload {
    book_id: number;
    title?: string;
    target_user_id?: number;
    observation?: string;
}

export interface ReservationReadyPayload {
    copy_id: number;
    pickup_hours: number;
    observation?: string;
}

export interface ReservationFulfillPayload {
    loan_id: number;
    observation?: string;
}

export interface ReservationCancelPayload {
    reason?: string;
}

export interface ReservationListParams {
    userId?: number;
    bookId?: number;
    status?: string;
    facultyId?: number;
    skip?: number;
    limit?: number;
}
