"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppSidebar } from "@/app/auth/sidebar/app-sidebar";
import { SiteHeader } from "@/app/auth/header/site-header";
import { serviceAuthPermissions } from "@/app/auth/permissions/serviceAuthPermissions";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/loading";

import { useAuth } from "@/hooks/use-auth";
import { useSystemData } from "../auth/useSystemData";

type AccessState = "checking" | "allowed" | "denied" | "error";

export default function LayoutModules({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useAuth();
    const { data, fetchSystemData, loading } = useSystemData();
    const [access, setAccess] = useState<{ pathname: string; status: AccessState } | null>(null);
    const [permissionAttempt, setPermissionAttempt] = useState(0);

    useEffect(() => {
        if (isAuthenticated === false) router.replace("/auth/login");
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated !== true) return;
        fetchSystemData();
    }, [fetchSystemData, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated !== true) return;
        let active = true;
        setAccess({ pathname, status: "checking" });
        serviceAuthPermissions(pathname)
            .then((result) => {
                if (active) {
                    setAccess({ pathname, status: result.permissions.length > 0 ? "allowed" : "denied" });
                }
            })
            .catch(() => {
                if (active) setAccess({ pathname, status: "error" });
            });
        return () => { active = false; };
    }, [isAuthenticated, pathname, permissionAttempt]);

    if (isAuthenticated === null || isAuthenticated === false || loading || !data || !access || access.pathname !== pathname || access.status === "checking") {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (access.status === "denied") {
        return (
            <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-3 p-6" role="alert">
                <h1 className="text-xl font-semibold">Acceso no autorizado</h1>
                <p className="text-muted-foreground">Tu cuenta no tiene permisos para acceder a este módulo.</p>
            </main>
        );
    }

    if (access.status === "error") {
        return (
            <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-3 p-6" role="alert">
                <h1 className="text-xl font-semibold">No se pudieron verificar los permisos</h1>
                <p className="text-muted-foreground">El contenido permanece oculto hasta confirmar el acceso con el servidor.</p>
                <button className="w-fit underline underline-offset-4" onClick={() => setPermissionAttempt((attempt) => attempt + 1)} type="button">
                    Reintentar
                </button>
            </main>
        );
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar modules={data.modules} variant="sidebar" />
            <SidebarInset>
                <SiteHeader user={data.user} />
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
