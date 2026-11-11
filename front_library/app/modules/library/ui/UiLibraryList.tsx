"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingText } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react";

import UiLibraryCreate from "./UiLibraryCreate";
import UiLibraryView   from "./UiLibraryView";
import UiLibraryEdit   from "./UiLibraryEdit";
import UiLibraryDelete from "./UiLibraryDelete";

import { LibraryList } from "../type/typeLibraryList";
import { useLibraryView } from "../hooks/useLibraryView";

type Props = {
    libraries: LibraryList[];
    loadingLibraries: boolean;
    errorLibraries: string | null;
    refreshLibraries: () => void;
};

export default function UiLibraryList({ libraries, loadingLibraries, errorLibraries, refreshLibraries }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [openView,   setOpenView]   = useState(false);
    const [openEdit,   setOpenEdit]   = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { library: specDetail, fetchLibrary, loading: loadingView } = useLibraryView();
    const selected = libraries.find((s) => s.id === selectedId) ?? null;

    const handleRowClick = (id: number) => setSelectedId((prev) => (prev === id ? null : id));

    const handleView = async () => {
        if (!selectedId) return;
        await fetchLibrary(selectedId);
        setOpenView(true);
    };

    if (loadingLibraries) return <LoadingText />;
    if (errorLibraries)   return <p className="text-destructive">{errorLibraries}</p>;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
                <UiLibraryCreate refreshLibraries={refreshLibraries} />
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
                        {libraries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-10 text-center text-muted-foreground">
                                    No hay bibliotecas registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            libraries.map((s) => (
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

            <UiLibraryView
                open={openView}
                onOpenChange={setOpenView}
                library={specDetail}
                loading={loadingView}
            />
            {selected && (
                <UiLibraryEdit
                    open={openEdit}
                    onOpenChange={setOpenEdit}
                    library={selected}
                    refreshLibraries={refreshLibraries}
                />
            )}
            <UiLibraryDelete
                open={openDelete}
                onOpenChange={setOpenDelete}
                id={selectedId}
                refreshLibraries={() => { refreshLibraries(); setSelectedId(null); }}
            />
        </div>
    );
}