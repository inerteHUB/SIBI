"use client";

import { useEffect } from "react";
import HeaderModule from "@/components/header-module";
import UiDocumentTypeList from "./ui/UiDocumentTypeList";
import { useDocumentTypeList } from "./hooks/useDocumentTypeList";

export default function ModuleDocumentType() {
    const { documentType, refreshDocumentTypes, loading: loadingDocumentTypes, error: errorDocumentTypes } = useDocumentTypeList();

    useEffect(() => {
        refreshDocumentTypes();
    }, []);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestión de Tipo de Documentos"
                description="Administra los tipos de documentos disponibles."
            />
            <UiDocumentTypeList
                documentTypes={documentType}
                loadingDocumentTypes={loadingDocumentTypes}
                errorDocumentTypes={errorDocumentTypes}
                refreshDocumentTypes={refreshDocumentTypes}
            />
        </div>
    );
}