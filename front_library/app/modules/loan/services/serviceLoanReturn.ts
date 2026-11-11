import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { LoanReturnPayload, LoanReturnResult } from "../type/typeLoanBase";

export const serviceLoanReturn = async (
    loanId: number,
    payload: LoanReturnPayload
): Promise<LoanReturnResult> => {
    const res = await fetch(`${apiBackend}/v1/loan/${loanId}/return`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    return handleApiResponse<LoanReturnResult>(res, "Error al procesar la devolución");
};
