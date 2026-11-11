"use client";

// react
import { useState } from "react";

// componentes UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/loading";

// hook
import { useRoleEdit } from "../hooks/useRoleEdit";

// iconos
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaEdit, FaRegSave } from "react-icons/fa";
import { ChevronRight, Folder, FileText } from "lucide-react";

// tipado
import { ModulesWithPermissionsList, ModulePermissionItem } from "../type/typeModulesWithPermissionsList";
import { RoleEdit } from "../type/typeRoleEdit";

type Props = {
    roleId: number;
    refreshRoles: () => void;
    modulesWithPermissions: ModulesWithPermissionsList[];
    loadingModulesWithPermissions: boolean;
    errorModulesWithPermissions: string | null;
    refreshModulesWithPermissions: () => void;
    disabled?: boolean;
};

// Nodo hoja con checkboxes
function ModuleLeaf({
    module,
    selectedIds,
    onPermissionChange,
}: {
    module: ModulesWithPermissionsList;
    selectedIds: number[];
    onPermissionChange: (moduleId: number, permissionId: number, checked: boolean) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-2 px-3 rounded-md border border-border bg-primary/5">
            <div className="flex items-center gap-2 sm:min-w-[160px]">
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm text-foreground">{module.name}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 sm:ml-2">
                {module.permissions.map((permission: ModulePermissionItem) => (
                    <FormItem key={`perm-${module.id}-${permission.id}`} className="flex flex-row items-center gap-2">
                        <FormControl>
                            <Checkbox
                                checked={selectedIds.includes(permission.id)}
                                onCheckedChange={ (checked) => onPermissionChange(module.id, permission.id, checked as boolean) }
                                className="border-primary"
                            />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-muted-foreground cursor-pointer select-none">
                            {permission.name}
                        </FormLabel>
                    </FormItem>
                ))}
            </div>
        </div>
    );
}

// Nodo árbol recursivo
function ModuleTreeNode({
    module,
    depth,
    getSelectedIds,
    onPermissionChange,
}: {
    module: ModulesWithPermissionsList;
    depth: number;
    getSelectedIds: (moduleId: number) => number[];
    onPermissionChange: (moduleId: number, permissionId: number, checked: boolean) => void;
}) {
    const [open, setOpen] = useState(true);
    const paddingLeft = depth * 16;

    if (!module.is_parent) {
        return (
            <div style={{ paddingLeft }}>
                <ModuleLeaf
                    module={module}
                    selectedIds={getSelectedIds(module.id)}
                    onPermissionChange={onPermissionChange}
                />
            </div>
        );
    }

    return (
        <div style={{ paddingLeft }}>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 py-1.5 px-2 w-full rounded-md hover:bg-primary/10 transition-colors">
                    <ChevronRight className={`size-4 text-primary transition-transform duration-200 ${open ? "rotate-90" : ""}`}/>
                    <Folder className="size-4 text-primary" />
                    <span className="font-semibold text-sm text-foreground">{module.name}</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1.5">
                    {module.children.map((child) => (
                        <ModuleTreeNode
                            key={child.id}
                            module={child}
                            depth={depth + 1}
                            getSelectedIds={getSelectedIds}
                            onPermissionChange={onPermissionChange}
                        />
                    ))}
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function UiRoleEdit({
    roleId,
    refreshRoles,
    modulesWithPermissions,
    loadingModulesWithPermissions,
    errorModulesWithPermissions,
    refreshModulesWithPermissions,
    disabled
}: Props) {
    const [open, setOpen] = useState(false);
    const { formRole, loadRole, updateRole, loading } = useRoleEdit(refreshRoles, setOpen);
    const [loadingRole, setLoadingRole] = useState(false);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            formRole.reset();
            setLoadingRole(true);
            try {
                const { serviceRoleView } = await import("../services/serviceRoleView");
                const [data] = await Promise.all([
                    serviceRoleView(roleId),
                    refreshModulesWithPermissions(),
                ]);
                loadRole(data);
            } finally {
                setLoadingRole(false);
            }
        }
    };

    const getSelectedIds = (moduleId: number): number[] =>
        formRole.watch("modules")?.find((m) => m.moduleId === moduleId)?.permissionIds ?? [];

    const handlePermissionChange = (moduleId: number, permissionId: number, checked: boolean) => {
        const current = formRole.getValues("modules");
        const entry = current.find((m) => m.moduleId === moduleId);

        if (checked) {
            if (!entry) {
                formRole.setValue(
                    "modules",
                    [...current, { moduleId, permissionIds: [permissionId] }],
                    { shouldValidate: true }
                );
            } else if (!entry.permissionIds.includes(permissionId)) {
                entry.permissionIds.push(permissionId);
                formRole.setValue(
                    "modules",
                    [...current.filter((m) => m.moduleId !== moduleId), entry],
                    { shouldValidate: true }
                );
            }
        } else if (entry) {
            entry.permissionIds = entry.permissionIds.filter((pid) => pid !== permissionId);
            formRole.setValue(
                "modules",
                entry.permissionIds.length === 0
                    ? current.filter((m) => m.moduleId !== moduleId)
                    : [...current.filter((m) => m.moduleId !== moduleId), entry],
                { shouldValidate: true }
            );
        }

        formRole.trigger("modules");
    };

    const isLoadingDialog = loadingRole || loadingModulesWithPermissions;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="info" disabled={disabled}>
                    <FaEdit /> Editar
                </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col overflow-y-auto h-full max-h-[calc(100%-5rem)] w-full lg:max-w-[calc(100%-20rem)] p-8">
                <DialogHeader className="mb-3">
                    <DialogTitle className="text-3xl font-bold text-foreground">Editar Rol</DialogTitle>
                    <DialogDescription>
                        Modifica el nombre, descripción y permisos asignados a este rol.
                    </DialogDescription>
                </DialogHeader>

                {isLoadingDialog ? (
                    <div className="flex items-center justify-center py-10">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <Form {...formRole}>
                        <form onSubmit={formRole.handleSubmit((data) => updateRole(roleId, data as RoleEdit))} className="space-y-6">
                            
                            <FormField
                                control={formRole.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground text-sm font-semibold">Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete="off" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={formRole.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground text-sm font-semibold">Descripción del rol</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe el propósito y alcance de este rol..."
                                                className="min-h-[40px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3">
                                <h3 className="text-foreground text-lg font-bold border-b pb-3">Permisos del rol</h3>

                                {errorModulesWithPermissions ? (
                                    <p className="text-destructive text-sm">Error al cargar módulos: {errorModulesWithPermissions}</p>
                                ) : modulesWithPermissions.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No hay módulos disponibles.</p>
                                ) : (
                                    <div className="space-y-1.5">
                                        {modulesWithPermissions.map((module) => (
                                            <ModuleTreeNode
                                                key={module.id}
                                                module={module}
                                                depth={0}
                                                getSelectedIds={getSelectedIds}
                                                onPermissionChange={handlePermissionChange}
                                            />
                                        ))}
                                    </div>
                                )}

                                <FormField
                                    control={formRole.control}
                                    name="modules"
                                    render={() => (
                                        <FormItem>
                                            <FormMessage>{formRole.formState.errors.modules?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-between items-center mt-8">
                                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                    <IoMdCloseCircleOutline className="size-5" />
                                    Cerrar
                                </Button>
                                <Button type="submit" variant="default" disabled={loading}>
                                    <FaRegSave />
                                    {loading ? "Guardando..." : "Guardar Rol"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}