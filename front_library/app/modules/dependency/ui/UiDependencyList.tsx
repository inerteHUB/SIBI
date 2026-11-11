"use client";

import { useState } from "react";
import { apiBackend } from "@/config/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingText } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react";

import UiDependencyCreate  from "./UiDependencyCreate";
import UiDependencyView    from "./UiDependencyView";
import UiDependencyEdit    from "./UiDependencyEdit";
import UiDependencyDelete  from "./UiDependencyDelete";
import UiDependencyEnable  from "./UiDependencyEnable";
import UiDependencyDisable from "./UiDependencyDisable";

import { DependencyList } from "../type/typeDependencyList";
import { DependencyForm } from "../type/typeDependencyForm";
import { useDependencyView } from "../hooks/useDependencyView";

type Props = {
    Dependencies: DependencyList[];
    loadingDependencies: boolean;
    errorDependencies: string | null;
    refreshDependencies: () => void;
    formData: DependencyForm;
    fetchFormData: () => Promise<void>;
};

const badgeVariantMap: Record<string, "default" | "warning" | "destructive"> = {
    Activo:        "default",
    Deshabilitado: "warning",
    Eliminado:     "destructive",
};

export default function UiDependencyList({
    Dependencies, loadingDependencies, errorDependencies,
    refreshDependencies, formData, fetchFormData,
}: Props) {
    const [selectedId,  setSelectedId]  = useState<number | null>(null);
    const [openView,    setOpenView]    = useState(false);
    const [openEdit,    setOpenEdit]    = useState(false);
    const [openDelete,  setOpenDelete]  = useState(false);
    const [openEnable,  setOpenEnable]  = useState(false);
    const [openDisable, setOpenDisable] = useState(false);

    const { dependency: dependencyDetail, fetchDependency, loading: loadingView } = useDependencyView();
    const selected = Dependencies.find((d) => d.id === selectedId) ?? null;

    const isActivo        = selected?.state === "Activo";
    const isDeshabilitado = selected?.state === "Deshabilitado";

    const handleRowClick = (id: number) => setSelectedId((prev) => (prev === id ? null : id));

    const handleView = async () => {
        if (!selectedId) return;
        await Promise.all([fetchDependency(selectedId), fetchFormData()]);
        setOpenView(true);
    };

    const handleEdit = async () => {
        if (!selected) return;
        await fetchFormData();
        setOpenEdit(true);
    };

    const getFacultyName = (id: number) =>
        formData.faculties.find((f) => f.id === id)?.name ?? "—";

    const getFacultyAbbreviation = (id: number) =>
        formData.faculties.find((f) => f.id === id)?.name.slice(0, 6) ?? "—";

    if (loadingDependencies) return <LoadingText />;
    if (errorDependencies)   return <p className="text-destructive">{errorDependencies}</p>;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
                <UiDependencyCreate
                    refreshDependencies={refreshDependencies}
                    formData={formData}
                    fetchFormData={fetchFormData}
                />
                <Button variant="success" disabled={!selected} onClick={handleView}>
                    <FaEye /> Visualizar
                </Button>
                <Button variant="info" disabled={!isActivo} onClick={handleEdit}>
                    <FaEdit /> Editar
                </Button>
                <Button variant="destructive" disabled={!isActivo && !isDeshabilitado} onClick={() => selected && setOpenDelete(true)}>
                    <Trash2 /> Eliminar
                </Button>
                <Button variant="success" disabled={!isDeshabilitado} onClick={() => selected && setOpenEnable(true)}>
                    <Trash2 /> Habilitar
                </Button>
                <Button variant="warning" disabled={!isActivo} onClick={() => selected && setOpenDisable(true)}>
                    <Trash2 /> Deshabilitar
                </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[60px]">N°</TableHead>
                            <TableHead>Facultad</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="w-[120px]">Abreviatura</TableHead>
                            <TableHead className="w-[80px] text-center">Logo</TableHead>
                            <TableHead className="w-[80px] text-center">Sello</TableHead>
                            <TableHead className="w-[110px]">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Dependencies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-10 text-center text-muted-foreground">
                                    No hay dependencias registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            Dependencies.map((dep) => (
                                <TableRow
                                    key={dep.id}
                                    onClick={() => handleRowClick(dep.id)}
                                    data-state={selectedId === dep.id ? "selected" : undefined}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-mono">{dep.id}</TableCell>
                                    <TableCell>{getFacultyName(dep.faculty_id)}</TableCell>
                                    <TableCell className="font-medium">{dep.name}</TableCell>
                                    <TableCell>{dep.abbreviation}</TableCell>
                                    <TableCell className="text-center">
                                        {dep.logo ? (
                                            <img src={`${apiBackend}/${dep.logo}`} alt="Logo" className="mx-auto h-10 w-10 rounded object-contain" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {dep.stamp ? (
                                            <img src={`${apiBackend}/${dep.stamp}`} alt="Sello" className="mx-auto h-10 w-10 rounded object-contain" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={badgeVariantMap[dep.state] ?? "secondary"} className="text-xs">
                                            {dep.state}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UiDependencyView
                open={openView}
                onOpenChange={setOpenView}
                dependency={dependencyDetail}
                loading={loadingView}
                formData={formData}
            />
            {selected && (
                <UiDependencyEdit
                    open={openEdit}
                    onOpenChange={setOpenEdit}
                    dependency={selected}
                    refreshDependencies={refreshDependencies}
                    formData={formData}
                />
            )}
            <UiDependencyDelete
                open={openDelete}  onOpenChange={setOpenDelete}
                id={selectedId}
                refreshDependencies={() => { refreshDependencies(); setSelectedId(null); }}
            />
            <UiDependencyEnable
                open={openEnable}  onOpenChange={setOpenEnable}
                id={selectedId}
                refreshDependencies={() => { refreshDependencies(); setSelectedId(null); }}
            />
            <UiDependencyDisable
                open={openDisable} onOpenChange={setOpenDisable}
                id={selectedId}
                refreshDependencies={() => { refreshDependencies(); setSelectedId(null); }}
            />
        </div>
    );
}