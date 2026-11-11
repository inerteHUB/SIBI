"use client";

import { useState } from "react";

// componentes UI
import { LoadingSpinner } from "@/components/loading";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// componentes
import UiRoleCreate from "./UiRoleCreate";
import UiRoleView   from "./UiRoleView";
import UiRoleEdit   from "./UiRoleEdit";
import UiRoleDelete from "./UiRoleDelete";

// tipado
import { RoleList } from "../type/typeRoleList";
import { ModulesWithPermissionsList } from "../type/typeModulesWithPermissionsList";

type Props = {
    roles: RoleList[];
    loadingRoles: boolean;
    errorRoles: string | null;
    refreshRoles: () => void;
    modulesWithPermissions: ModulesWithPermissionsList[];
    loadingModulesWithPermissions: boolean;
    errorModulesWithPermissions: string | null;
    refreshModulesWithPermissions: () => void;
};

export default function UiRoleList({
    roles,
    loadingRoles,
    errorRoles,
    refreshRoles,
    modulesWithPermissions,
    loadingModulesWithPermissions,
    errorModulesWithPermissions,
    refreshModulesWithPermissions,
}: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selected = roles.find((r) => r.id === selectedId) ?? null;

    const moduleProps = {
        modulesWithPermissions,
        loadingModulesWithPermissions,
        errorModulesWithPermissions,
        refreshModulesWithPermissions,
    };

    if (loadingRoles) return <LoadingSpinner />;
    if (errorRoles)   return <p className="text-destructive">{errorRoles}</p>;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                <UiRoleCreate
                    refreshRoles={refreshRoles}
                    {...moduleProps}
                />
                <UiRoleEdit
                    roleId={selectedId!}
                    refreshRoles={() => { refreshRoles(); setSelectedId(null); }}
                    disabled={!selected}
                    {...moduleProps}
                />
                <UiRoleView
                    roleId={selectedId!}
                    disabled={!selected}
                    {...moduleProps}
                />
                <UiRoleDelete
                    id={selectedId!}
                    refreshRoles={() => { refreshRoles(); setSelectedId(null); }}
                    disabled={!selected}
                />
            </div>

            {roles.length === 0 ? (
                <p className="text-primary/80 text-base text-center">No hay roles registrados</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {roles.map((role) => {
                        const isSelected = selectedId === role.id;
                        return (
                            <Card
                                key={role.id}
                                onClick={() => setSelectedId((prev) => (prev === role.id ? null : role.id))}
                                data-selected={isSelected}
                                className="py-4 bg-background cursor-pointer select-none transition-all
                                           data-[selected=true]:ring-2 data-[selected=true]:ring-primary
                                           data-[selected=true]:bg-primary/5"
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl">{role.name}</CardTitle>
                                    <CardDescription>
                                        {role.description
                                            ? role.description.length > 80
                                                ? role.description.slice(0, 80) + "…"
                                                : role.description
                                            : "Sin descripción."}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
