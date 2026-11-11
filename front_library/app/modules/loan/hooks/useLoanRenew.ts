"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceLoanRenew } from "../services/serviceLoanRenew";
import { LoanRenewPayload } from "../type/typeLoanBase";

export const useLoanRenew = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const processRenew = async (loanId: number, payload: LoanRenewPayload) => {
        setLoading(true);
        try {
            await serviceLoanRenew(loanId, payload);
            toast.success("Plazo de préstamo renovado con éxito.");
            onSuccess();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al renovar el préstamo");
        } finally {
            setLoading(false);
        }
    };

    return { processRenew, loading };
};
