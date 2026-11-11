"use client";

import { useEffect } from "react";
import HeaderModule from "@/components/header-module";
import UiSpecializationList from "./ui/UiSpecializationList";
import { useSpecializationList } from "./hooks/useSpecializationList";

export default function ModuleSpecialization() {
    const { specializations, refreshSpecializations, loading: loadingSpecializations, error: errorSpecializations } = useSpecializationList();

    useEffect(() => {
        refreshSpecializations();
    }, []);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestión de Especializaciones"
                description="Administra las especializaciones disponibles para los jurados."
            />
            <UiSpecializationList
                specializations={specializations}
                loadingSpecializations={loadingSpecializations}
                errorSpecializations={errorSpecializations}
                refreshSpecializations={refreshSpecializations}
            />
        </div>
    );
}