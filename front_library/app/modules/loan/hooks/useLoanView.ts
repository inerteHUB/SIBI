"use client";

import { useState } from "react";
import { Loan } from "../type/typeLoanBase";
import { serviceLoanView } from "../services/serviceLoanView";

export const useLoanView = () => {
    const [loan, setLoan] = useState<Loan | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLoan = async (loanId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceLoanView(loanId);
            setLoan(data);
            return data;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Error al cargar préstamo";
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loan, loading, error, fetchLoan, setLoan };
};
