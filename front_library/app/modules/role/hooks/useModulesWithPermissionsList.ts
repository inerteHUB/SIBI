"use client";

import { useState } from "react";
import { ModulesWithPermissionsList } from "../type/typeModulesWithPermissionsList";
import { serviceModulesWithPermissionsList } from "../services/serviceModulesWithPermissionsList";

export const useModulesWithPermissionsList = () => {
    const [modulesWithPermissions, setModulesWithPermissions] = useState<ModulesWithPermissionsList[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshModulesWithPermissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceModulesWithPermissionsList();
            setModulesWithPermissions(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return { modulesWithPermissions, loading, error, refreshModulesWithPermissions };
};