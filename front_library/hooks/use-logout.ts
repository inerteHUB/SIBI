"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const logout = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/session/logout", {
                method: "POST",
                credentials: "same-origin",
            });
            if (!response.ok) throw new Error("No se pudo cerrar la sesión de forma segura.");
        } finally {
            router.replace("/auth/login");
            router.refresh();
        }
    };

    return { logout, loading };
}
