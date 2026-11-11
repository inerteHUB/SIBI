"use client";

import { useState, useCallback } from "react";
import { Loan } from "../type/typeLoanBase";
import { serviceLoanList, LoanListParams } from "../services/serviceLoanList";

export const useLoanList = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLoans = useCallback(async (params?: LoanListParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceLoanList(params);
            setLoans(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar préstamos");
        } finally {
            setLoading(false);
        }
    }, []);

    return { loans, setLoans, loading, error, refreshLoans: fetchLoans };
};
