"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/app/auth/sidebar/app-sidebar";
import { SiteHeader } from "@/app/auth/header/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/loading";

import { useAuth } from "@/hooks/use-auth";
import { useSystemData } from "../auth/useSystemData";

export default function LayoutModules({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const isAuthenticated = useAuth();
    const { data, fetchSystemData, loading } = useSystemData();

    useEffect(() => {
        if (isAuthenticated === false) router.replace("/auth/login");
    }, [isAuthenticated, router]);

    useEffect(() => {
        fetchSystemData(); // sin await, useEffect no es async
    }, []);

    // Mientras se verifica auth o se cargan datos → spinner
    if (isAuthenticated === null || loading || !data) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <LoadingSpinner />
            </div>
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
