import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Loan, LoanRenewPayload } from "../type/typeLoanBase";

export const serviceLoanRenew = async (
    loanId: number,
    payload: LoanRenewPayload
): Promise<Loan> => {
    const res = await fetch(`${apiBackend}/v1/loan/${loanId}/renew`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    return handleApiResponse<Loan>(res, "Error al renovar el préstamo");
};
