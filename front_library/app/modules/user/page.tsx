"use client";

import { useEffect } from "react";
import HeaderModule from "@/components/header-module";
import UiUserList from "./ui/UiUserList";
import { useUserList } from "./hooks/useUserList";
import { useUserForm } from "./hooks/useUserForm";

export default function ModuleUser() {
    const { Users, refreshUsers, loading: loadingUsers, error: errorUsers } = useUserList();
    const { formData, fetchFormData } = useUserForm();

    useEffect(() => {
        refreshUsers();
        fetchFormData();
    }, []);

    return (
        <div className="flex flex-1 flex-col space-y-6">
            <HeaderModule
                title="Gestión de Usuarios"
                description="Administra los usuarios del sistema."
            />
            <UiUserList
                Users={Users}
                loadingUsers={loadingUsers}
                errorUsers={errorUsers}
                refreshUsers={refreshUsers}
                formData={formData}
                fetchFormData={fetchFormData}
            />
        </div>
    );
}