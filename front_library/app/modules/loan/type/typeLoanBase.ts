export interface LoanDetail {
    id: number;
    loan_id: number;
    copy_id: number;
    copy_code?: string;
    title?: string;
    return_date?: string;
    initial_condition?: string;
    final_condition?: string;
    status: string;
    notes?: string;
}

export interface LoanUserInfo {
    id: number;
    username: string;
    full_name: string;
    dni: string;
    email: string;
}

export interface Loan {
    id: number;
    code: string;
    user_id: number;
    librarian_id?: number;
    faculty_id?: number;
    loan_type: "Sala" | "Domicilio" | string;
    loan_date: string;
    due_date: string;
    return_date?: string;
    status: "Activo" | "Devuelto" | "Renovado" | "Cancelado" | string;
    renewal_count: number;
    max_renewals: number;
    observation?: string;
    is_overdue: boolean;
    days_overdue: number;
    user?: LoanUserInfo;
    details: LoanDetail[];
}

export interface LoanCreateItem {
    copy_id: number;
    copy_code?: string;
    title?: string;
    initial_condition?: string;
    notes?: string;
}

export interface LoanCreatePayload {
    user_id: number;
    loan_type: "Sala" | "Domicilio";
    days: number;
    observation?: string;
    details: LoanCreateItem[];
}

export interface LoanReturnDetailItem {
    detail_id: number;
    final_condition: "Bueno" | "Regular" | "Dañado" | "Extraviado" | string;
    notes?: string;
}

export interface LoanReturnPayload {
    details: LoanReturnDetailItem[];
    observation?: string;
}

export interface LoanRenewPayload {
    additional_days: number;
    observation?: string;
}

export interface LoanReturnResult {
    loan_id: number;
    code: string;
    status: string;
    is_overdue: boolean;
    days_overdue: number;
    message: string;
    survey_eligible: boolean;
    survey_prompt: string;
}
