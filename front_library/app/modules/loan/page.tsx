"use client";

import { useEffect } from "react";
import HeaderModule from "@/components/header-module";
import UiLoanList from "./ui/UiLoanList";
import { useLoanList } from "./hooks/useLoanList";

export default function ModuleLoan() {
    const { loans, refreshLoans, loading: loadingLoans, error: errorLoans } = useLoanList();

    useEffect(() => {
        refreshLoans();
    }, [refreshLoans]);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestión de Préstamos y Circulación"
                description="Control de préstamos en sala y a domicilio, renovaciones y registro de devoluciones con verificación de retraso."
            />
            <UiLoanList
                loans={loans}
                loadingLoans={loadingLoans}
                errorLoans={errorLoans}
                refreshLoans={refreshLoans}
            />
        </div>
    );
}
