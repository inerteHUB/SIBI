"use client";

// react
import { useEffect } from "react";

// componentes
import HeaderModule from "@/components/header-module";
import UiFacultyList from "./ui/UiFacultyList";

// hooks 
import { useFacultyList } from "./hooks/useFacultyList";

export default function ModuleFaculty() {
    const { Faculties, refreshFaculties, loading: loadingFaculties, error: errorFaculties } = useFacultyList();

    useEffect(() => {
        refreshFaculties();
    }, []);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestion de Facultades"
                description="Administra las facultades del sistema."
            />
            <UiFacultyList
                Faculties={Faculties}
                loadingFaculties={loadingFaculties}
                errorFaculties={errorFaculties}
                refreshFaculties={refreshFaculties}
            />
        </div>
    );
}