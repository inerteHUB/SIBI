"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSpecializationEdit } from "../hooks/useSpecializationEdit";
import { SpecializationList } from "../type/typeSpecializationList";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    specialization: SpecializationList | null;
    refreshSpecializations: () => void;
};

export default function UiSpecializationEdit({ open, onOpenChange, specialization, refreshSpecializations }: Props) {
    const { formSpecialization, editSpecialization, loading } = useSpecializationEdit(
        specialization?.id ?? 0,
        () => { refreshSpecializations(); onOpenChange(false); }
    );

    useEffect(() => {
        if (specialization && open) {
            formSpecialization.reset({ name: specialization.name });
        }
        if (!open) {
            formSpecialization.reset();
        }
    }, [specialization, open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Editar Especialización</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formSpecialization}>
                        <form onSubmit={formSpecialization.handleSubmit(editSpecialization)} className="space-y-4">
                            <FormField
                                control={formSpecialization.control}
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