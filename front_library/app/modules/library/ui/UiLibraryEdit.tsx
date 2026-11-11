"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useLibraryEdit } from "../hooks/useLibraryEdit";
import { LibraryList } from "../type/typeLibraryList";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    library: LibraryList | null;
    refreshLibraries: () => void;
};

export default function UiLibraryEdit({ open, onOpenChange, library, refreshLibraries }: Props) {
    const { formLibrary, editLibrary, loading } = useLibraryEdit(
        library?.id ?? 0,
        () => { refreshLibraries(); onOpenChange(false); }
    );

    useEffect(() => {
        if (library && open) {
            formLibrary.reset({ name: library.name });
        }
        if (!open) {
            formLibrary.reset();
        }
    }, [library, open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Editar Biblioteca</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formLibrary}>
                        <form onSubmit={formLibrary.handleSubmit(editLibrary)} className="space-y-4">
                            <FormField
                                control={formLibrary.control}
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