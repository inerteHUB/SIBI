import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Loan } from "../type/typeLoanBase";

export interface LoanListParams {
    userId?: number;
    status?: string;
    loanType?: string;
    isOverdueOnly?: boolean;
    skip?: number;
    limit?: number;
}

export const serviceLoanList = async (params?: LoanListParams): Promise<Loan[]> => {
    const query = new URLSearchParams();
    if (params?.userId) query.append("user_id", String(params.userId));
    if (params?.status && params.status !== "TODOS") query.append("status", params.status);
    if (params?.loanType && params.loanType !== "TODOS") query.append("loan_type", params.loanType);
    if (params?.isOverdueOnly) query.append("is_overdue_only", "true");
    if (params?.skip !== undefined) query.append("skip", String(params.skip));
    if (params?.limit !== undefined) query.append("limit", String(params.limit));

    const url = `${apiBackend}/v1/loan/?${query.toString()}`;
    const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleApiResponse<Loan[]>(res, "No se pudieron cargar los préstamos");
};
