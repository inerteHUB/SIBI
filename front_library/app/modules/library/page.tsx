"use client";

import { useEffect } from "react";
import HeaderModule from "@/components/header-module";
import UiLibraryList from "./ui/UiLibraryList";
import { useLibraryList } from "./hooks/useLibraryList";

export default function ModuleLibrary() {
    const { library, refreshLibraries, loading: loadingLibraries, error: errorLibraries } = useLibraryList();

    useEffect(() => {
        refreshLibraries();
    }, []);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestión de Bibliotecas"
                description="Administra las bibliotecas disponibles para la UNSM."
            />
            <UiLibraryList
                libraries={library}
                loadingLibraries={loadingLibraries}
                errorLibraries={errorLibraries}
                refreshLibraries={refreshLibraries}
            />
        </div>
    );
}