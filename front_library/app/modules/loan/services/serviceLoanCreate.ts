import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Loan, LoanCreatePayload } from "../type/typeLoanBase";

export const serviceLoanCreate = async (payload: LoanCreatePayload): Promise<Loan> => {
    const res = await fetch(`${apiBackend}/v1/loan/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    return handleApiResponse<Loan>(res, "Error al registrar el préstamo");
};
