import { apiBackend } from "@/config/constants";
import { getAuthHeaders, handleApiResponse } from "@/lib/utils";
import { Loan } from "../type/typeLoanBase";

export const serviceLoanView = async (loanId: number): Promise<Loan> => {
    const res = await fetch(`${apiBackend}/v1/loan/${loanId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleApiResponse<Loan>(res, "No se pudo obtener el detalle del préstamo");
};
