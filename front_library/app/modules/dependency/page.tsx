"use client";

import { useEffect } from "react";
import HeaderModule from "@/components/header-module";
import UiDependencyList from "./ui/UiDependencyList";
import { useDependencyList } from "./hooks/useDependencyList";
import { useDependencyForm } from "./hooks/useDependencyForm";

export default function ModuleDependency() {
    const { Dependencies, refreshDependencies, loading: loadingDependencies, error: errorDependencies } = useDependencyList();
    const { formData, fetchFormData } = useDependencyForm();

    useEffect(() => {
        refreshDependencies();
        fetchFormData();
    }, []);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestión de Dependencias"
                description="Administra las dependencias de las facultades en el sistema."
            />
            <UiDependencyList
                Dependencies={Dependencies}
                loadingDependencies={loadingDependencies}
                errorDependencies={errorDependencies}
                refreshDependencies={refreshDependencies}
                formData={formData}
                fetchFormData={fetchFormData}
            />
        </div>
    );
}