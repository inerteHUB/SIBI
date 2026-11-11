"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FaRegSave } from "react-icons/fa";
import { IoIosAddCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { useDocumentTypeCreate } from "../hooks/useDocumentTypeCreate";

type Props = { refreshDocumentTypes: () => void };

export default function UiDocumentTypeCreate({ refreshDocumentTypes }: Props) {
    const { formDocumentType, createDocumentType, loading } = useDocumentTypeCreate(refreshDocumentTypes);
    const [open, setOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) formDocumentType.reset();
        setOpen(isOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                    <IoIosAddCircle className="h-4 w-4" /> Registrar
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Registrar Tipo de documento</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formDocumentType}>
                        <form onSubmit={formDocumentType.handleSubmit(createDocumentType)} className="space-y-4">
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
                                <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
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