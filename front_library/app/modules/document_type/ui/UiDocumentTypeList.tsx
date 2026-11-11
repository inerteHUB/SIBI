"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingText } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { Trash2 } from "lucide-react";

import UiDocumentTypeCreate from "./UiDocumentTypeCreate";
import UiDocumentTypeView   from "./UiDocumentTypeView";
import UiDocumentTypeEdit   from "./UiDocumentTypeEdit";
import UiDocumentTypeDelete from "./UiDocumentTypeDelete";

import { DocumentTypeList } from "../type/typeDocumentTypeList";
import { useDocumentTypeView } from "../hooks/useDocumentTypeView";

type Props = {
    documentTypes: DocumentTypeList[];
    loadingDocumentTypes: boolean;
    errorDocumentTypes: string | null;
    refreshDocumentTypes: () => void;
};

export default function UiDocumentTypeList({ documentTypes, loadingDocumentTypes, errorDocumentTypes, refreshDocumentTypes }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [openView,   setOpenView]   = useState(false);
    const [openEdit,   setOpenEdit]   = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { documentType: specDetail, fetchDocumentType, loading: loadingView } = useDocumentTypeView();
    const selected = documentTypes.find((s) => s.id === selectedId) ?? null;

    const handleRowClick = (id: number) => setSelectedId((prev) => (prev === id ? null : id));

    const handleView = async () => {
        if (!selectedId) return;
        await fetchDocumentType(selectedId);
        setOpenView(true);
    };

    if (loadingDocumentTypes) return <LoadingText />;
    if (errorDocumentTypes)   return <p className="text-destructive">{errorDocumentTypes}</p>;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
                <UiDocumentTypeCreate refreshDocumentTypes={refreshDocumentTypes} />
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
                        {documentTypes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-10 text-center text-muted-foreground">
                                    No hay tipo de documentos registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            documentTypes.map((s) => (
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

            <UiDocumentTypeView
                open={openView}
                onOpenChange={setOpenView}
                documentType={specDetail}
                loading={loadingView}
            />
            {selected && (
                <UiDocumentTypeEdit
                    open={openEdit}
                    onOpenChange={setOpenEdit}
                    document_type={selected}
                    refreshDocumentTypes={refreshDocumentTypes}
                />
            )}
            <UiDocumentTypeDelete
                open={openDelete}
                onOpenChange={setOpenDelete}
                id={selectedId}
                refreshDocumentTypes={() => { refreshDocumentTypes(); setSelectedId(null); }}
            />
        </div>
    );
}