"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDocumentTypeEdit } from "../hooks/useDocumentTypeEdit";
import { DocumentTypeList } from "../type/typeDocumentTypeList";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document_type: DocumentTypeList | null;
    refreshDocumentTypes: () => void;
};

export default function UiDocumentTypeEdit({ open, onOpenChange, document_type, refreshDocumentTypes }: Props) {
    const { formDocumentType, editDocumentType, loading } = useDocumentTypeEdit(
        document_type?.id ?? 0,
        () => { refreshDocumentTypes(); onOpenChange(false); }
    );

    useEffect(() => {
        if (document_type && open) {
            formDocumentType.reset({ name: document_type.name });
        }
        if (!open) {
            formDocumentType.reset();
        }
    }, [document_type, open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Editar Tipo de Documento</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formDocumentType}>
                        <form onSubmit={formDocumentType.handleSubmit(editDocumentType)} className="space-y-4">
                            <FormField
                                control={formDocumentType.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre <span className="text-destructive">*</span></FormLabel>
                                        <FormControl><Input autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center mt-8">
                                <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                                    <IoMdCloseCircleOutline className="size-5" /> Cerrar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    <FaRegSave /> {loading ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}