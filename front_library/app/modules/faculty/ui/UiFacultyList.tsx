"use client";

import { useState } from "react";
import { apiBackend } from "@/config/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingText } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react";

import UiFacultyCreate  from "./UiFacultyCreate";
import UiFacultyView    from "./UiFacultyView";
import UiFacultyEdit    from "./UiFacultyEdit";
import UiFacultyDelete  from "./UiFacultyDelete";

import { FacultyList } from "../type/typeFacultyList";
import { useFacultyView } from "../hooks/useFacultyView";

type Props = {
    Faculties: FacultyList[];
    loadingFaculties: boolean;
    errorFaculties: string | null;
    refreshFaculties: () => void;
};

const badgeVariantMap: Record<string, "default" | "warning" | "destructive"> = {
    Activo:        "default",
    Deshabilitado: "warning",
    Eliminado:     "destructive",
};

export default function UiFacultyList({ Faculties, loadingFaculties, errorFaculties, refreshFaculties }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [openView,    setOpenView]    = useState(false);
    const [openEdit,    setOpenEdit]    = useState(false);
    const [openDelete,  setOpenDelete]  = useState(false);

    const { faculty: facultyDetail, fetchFaculty, loading: loadingView } = useFacultyView();
    const selected = Faculties.find((f) => f.id === selectedId) ?? null;

    const isActivo        = selected?.state === "Activo";
    const isDeshabilitado = selected?.state === "Deshabilitado";

    const handleRowClick = (id: number) => setSelectedId((prev) => (prev === id ? null : id));

    const handleView = async () => {
        if (!selectedId) return;
        await fetchFaculty(selectedId);
        setOpenView(true);
    };

    if (loadingFaculties) return <LoadingText />;
    if (errorFaculties)   return <p className="text-destructive">{errorFaculties}</p>;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
                <UiFacultyCreate refreshFaculties={refreshFaculties} />
                <Button variant="success" disabled={!selected} onClick={handleView}>
                    <FaEye /> Visualizar
                </Button>
                <Button variant="info" disabled={!isActivo} onClick={() => selected && setOpenEdit(true)}>
                    <FaEdit /> Editar
                </Button>
                <Button variant="destructive" disabled={!isActivo && !isDeshabilitado} onClick={() => selected && setOpenDelete(true)}>
                    <Trash2 /> Eliminar
                </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[60px]">N°</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="w-[120px]">Abreviatura</TableHead>
                            <TableHead className="w-[80px] text-center">Logo</TableHead>
                            <TableHead className="w-[80px] text-center">Sello</TableHead>
                            <TableHead className="w-[110px]">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Faculties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-10 text-center text-muted-foreground">
                                    No hay facultades registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            Faculties.map((faculty) => (
                                <TableRow
                                    key={faculty.id}
                                    onClick={() => handleRowClick(faculty.id)}
                                    data-state={selectedId === faculty.id ? "selected" : undefined}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-mono">{faculty.id}</TableCell>
                                    <TableCell className="font-medium">{faculty.name}</TableCell>
                                    <TableCell>{faculty.abbreviation}</TableCell>
                                    <TableCell className="text-center">
                                        {faculty.logo ? (
                                            <img src={`${apiBackend}/${faculty.logo}`} alt="Logo" className="mx-auto h-10 w-10 rounded object-contain" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {faculty.stamp ? (
                                            <img src={`${apiBackend}/${faculty.stamp}`} alt="Sello" className="mx-auto h-10 w-10 rounded object-contain" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={badgeVariantMap[faculty.state] ?? "secondary"} className="text-xs">
                                            {faculty.state}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UiFacultyView open={openView} onOpenChange={setOpenView} faculty={facultyDetail} loading={loadingView} />
            {selected && (
                <UiFacultyEdit open={openEdit} onOpenChange={setOpenEdit} faculty={selected} refreshFaculties={refreshFaculties} />
            )}
            <UiFacultyDelete  open={openDelete}  onOpenChange={setOpenDelete}  id={selectedId} refreshFaculties={() => { refreshFaculties(); setSelectedId(null); }} />
        </div>
    );
}