"use client"

import { useRouter } from "next/navigation"
import { useState } from "react";

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const logout = () => {
        setLoading(true);
        localStorage.removeItem("token");
        router.push("/auth/login/");
    };

    return { logout, loading };
}
