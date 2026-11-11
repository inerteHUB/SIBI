"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceLoanReturn } from "../services/serviceLoanReturn";
import { LoanReturnPayload, LoanReturnResult } from "../type/typeLoanBase";

export const useLoanReturn = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState<LoanReturnResult | null>(null);

    const processReturn = async (
        loanId: number,
        payload: LoanReturnPayload
    ): Promise<LoanReturnResult | null> => {
        setLoading(true);
        try {
            const result = await serviceLoanReturn(loanId, payload);
            setLastResult(result);
            if (result.is_overdue) {
                toast.warning(`Devolución procesada con ${result.days_overdue} día(s) de atraso.`);
            } else {
                toast.success("Devolución registrada correctamente.");
            }
            onSuccess();
            return result;
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al procesar la devolución");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { processReturn, loading, lastResult, setLastResult };
};
