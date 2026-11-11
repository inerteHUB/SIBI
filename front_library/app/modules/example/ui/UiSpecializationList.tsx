"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingText } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react";

import UiSpecializationCreate from "./UiSpecializationCreate";
import UiSpecializationView   from "./UiSpecializationView";
import UiSpecializationEdit   from "./UiSpecializationEdit";
import UiSpecializationDelete from "./UiSpecializationDelete";

import { SpecializationList } from "../type/typeSpecializationList";
import { useSpecializationView } from "../hooks/useSpecializationView";

type Props = {
    specializations: SpecializationList[];
    loadingSpecializations: boolean;
    errorSpecializations: string | null;
    refreshSpecializations: () => void;
};

export default function UiSpecializationList({ specializations, loadingSpecializations, errorSpecializations, refreshSpecializations }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [openView,   setOpenView]   = useState(false);
    const [openEdit,   setOpenEdit]   = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { specialization: specDetail, fetchSpecialization, loading: loadingView } = useSpecializationView();
    const selected = specializations.find((s) => s.id === selectedId) ?? null;

    const handleRowClick = (id: number) => setSelectedId((prev) => (prev === id ? null : id));

    const handleView = async () => {
        if (!selectedId) return;
        await fetchSpecialization(selectedId);
        setOpenView(true);
    };

    if (loadingSpecializations) return <LoadingText />;
    if (errorSpecializations)   return <p className="text-destructive">{errorSpecializations}</p>;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
                <UiSpecializationCreate refreshSpecializations={refreshSpecializations} />
                <Button variant="success" disabled={!selected} onClick={handleView}>
                    <FaEye /> Visualizar
                </Button>
                <Button variant="info" disabled={!selected} onClick={() => selected && setOpenEdit(true)}>
                    <FaEdit /> Editar
                </Button>
                <Button variant="destructive" disabled={!selected} onClick={() => selected && setOpenDelete(true)}>
                    <Trash2 /> Eliminar
                </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[60px]">N°</TableHead>
                            <TableHead>Nombre</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {specializations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-10 text-center text-muted-foreground">
                                    No hay especializaciones registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            specializations.map((s) => (
                                <TableRow
                                    key={s.id}
                                    onClick={() => handleRowClick(s.id)}
                                    data-state={selectedId === s.id ? "selected" : undefined}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-mono">{s.id}</TableCell>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UiSpecializationView
                open={openView}
                onOpenChange={setOpenView}
                specialization={specDetail}
                loading={loadingView}
            />
            {selected && (
                <UiSpecializationEdit
                    open={openEdit}
                    onOpenChange={setOpenEdit}
                    specialization={selected}
                    refreshSpecializations={refreshSpecializations}
                />
            )}
            <UiSpecializationDelete
                open={openDelete}
                onOpenChange={setOpenDelete}
                id={selectedId}
                refreshSpecializations={() => { refreshSpecializations(); setSelectedId(null); }}
            />
        </div>
    );
}