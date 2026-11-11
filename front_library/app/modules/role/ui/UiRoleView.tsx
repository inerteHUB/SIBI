"use client";

// react
import { useState } from "react";

// componentes UI
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading";

// hook
import { useRoleView } from "../hooks/useRoleView";

// iconos
import { ChevronRight, Folder, FileText } from "lucide-react";
import { FaEye } from "react-icons/fa";

// tipado
import { ModulesWithPermissionsList } from "../type/typeModulesWithPermissionsList";
import { RoleView } from "../type/typeRoleView";

type Props = {
    roleId: number;
    modulesWithPermissions: ModulesWithPermissionsList[];
    loadingModulesWithPermissions: boolean;
    refreshModulesWithPermissions: () => void;
    disabled?: boolean;
};

// IDs de module_permission asignados al rol
function getAssignedIds(role: RoleView): Set<number> {
    return new Set(role.role_permissions.map((rp) => rp.module_permission_id));
}

// Nodo hoja: muestra permisos con badge si están asignados
function ViewLeaf({
    module,
    assignedIds,
}: {
    module: ModulesWithPermissionsList;
    assignedIds: Set<number>;
}) {
    const hasAny = module.permissions.some((p) => assignedIds.has(p.id));
    if (!hasAny) return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-2 px-3 rounded-md border border-border bg-primary/5">
            <div className="flex items-center gap-2 sm:min-w-[160px]">
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm text-foreground">{module.name}</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-2">
                {module.permissions
                    .filter((p) => assignedIds.has(p.id))
                    .map((p) => (
                        <Badge key={p.id} variant="secondary" className="text-xs">
                            {p.name}
                        </Badge>
                    ))}
            </div>
        </div>
    );
}

// Nodo árbol recursivo (solo muestra nodos con permisos asignados)
function ViewTreeNode({
    module,
    depth,
    assignedIds,
}: {
    module: ModulesWithPermissionsList;
    depth: number;
    assignedIds: Set<number>;
}) {
    const [open, setOpen] = useState(true);
    const paddingLeft = depth * 16;

    if (!module.is_parent) {
        return (
            <div style={{ paddingLeft }}>
                <ViewLeaf module={module} assignedIds={assignedIds} />
            </div>
        );
    }

    // Para padres: solo renderizar si algún descendiente tiene permisos asignados
    const hasDescendants = (node: ModulesWithPermissionsList): boolean => {
        if (!node.is_parent) return node.permissions.some((p) => assignedIds.has(p.id));
        return node.children.some(hasDescendants);
    };

    if (!hasDescendants(module)) return null;

    return (
        <div style={{ paddingLeft }}>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 py-1.5 px-2 w-full rounded-md hover:bg-primary/10 transition-colors">
                    <ChevronRight
                        className={`size-4 text-primary transition-transform duration-200 ${open ? "rotate-90" : ""}`}
                    />
                    <Folder className="size-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">{module.name}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1.5">
                    {module.children.map((child) => (
                        <ViewTreeNode
                            key={child.id}
                            module={child}
                            depth={depth + 1}
                            assignedIds={assignedIds}
                        />
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

// Componente principal
export default function UiRoleView({
    roleId,
    modulesWithPermissions,
    loadingModulesWithPermissions,
    refreshModulesWithPermissions,
    disabled
}: Props) {
    const [open, setOpen] = useState(false);
    const { role, fetchRole, loading: loadingRole } = useRoleView();

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            await Promise.all([fetchRole(roleId), refreshModulesWithPermissions()]);
        }
    };

    const assignedIds = getAssignedIds(role);
    const isLoading = loadingRole || loadingModulesWithPermissions;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="success" disabled={disabled}>
                    <FaEye className="size-4" /> Visualizar
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col overflow-y-auto h-full max-h-[calc(100%-5rem)] w-full lg:max-w-[calc(100%-20rem)] p-8">
                <DialogHeader className="mb-3">
                    <DialogTitle className="text-3xl font-bold text-foreground">
                        {role.name || "Detalle del Rol"}
                    </DialogTitle>
                    <DialogDescription>
                        {role.description || "Sin descripción."}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-foreground text-lg font-bold border-b pb-3">
                            Permisos asignados
                        </h3>
                        {modulesWithPermissions.length === 0 || assignedIds.size === 0 ? (
                            <p className="text-muted-foreground text-sm">Este rol no tiene permisos asignados.</p>
                        ) : (
                            <div className="space-y-1.5">
                                {modulesWithPermissions.map((module) => (
                                    <ViewTreeNode
                                        key={module.id}
                                        module={module}
                                        depth={0}
                                        assignedIds={assignedIds}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end mt-8">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}