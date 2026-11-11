"use client";

import { useEffect, useState } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch("/api/v1/auth/system-data", {
            credentials: "same-origin",
            cache: "no-store",
            signal: controller.signal,
        })
            .then((response) => setIsAuthenticated(response.ok))
            .catch(() => {
                if (!controller.signal.aborted) setIsAuthenticated(false);
            });

        return () => controller.abort();
    }, []);

    return isAuthenticated;
}
