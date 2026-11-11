"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoIosAddCircle } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { useReservationCreate } from "../hooks/useReservationCreate";

interface Props {
    refreshReservations: () => void;
}

export default function UiReservationCreate({ refreshReservations }: Props) {
    const [open, setOpen] = useState(false);
    const { formReservation, loading } = useReservationCreate(() => {
        refreshReservations();
        setOpen(false);
    });

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) formReservation.reset();
        setOpen(isOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                    <IoIosAddCircle className="size-4" /> Solicitar Reserva
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-lg border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-3">Registrar Nueva Reserva</SheetTitle>
                </SheetHeader>

                <div className="py-4">
                    <Form {...formReservation}>
                        <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
                            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200" role="status">
                                <p className="font-semibold">Selección de libros no disponible</p>
                                <p className="mt-1 text-xs leading-relaxed">
                                    La OpenAPI no publica un catálogo de libros. No se enviará una reserva con identificadores ingresados o inventados manualmente.
                                </p>
                            </div>
                            {/* Libro y Título */}
                            <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Datos del Material</h4>
                                
                                <FormField
                                    control={formReservation.control}
                                    name="book_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID del Libro / Obra <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} placeholder="Catálogo no disponible" {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={formReservation.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título del Libro <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Catálogo no disponible" {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Lector Asignado */}
                            <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lector Solicitante</h4>

                                <FormField
                                    control={formReservation.control}
                                    name="target_user_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID del Usuario / Lector</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    placeholder="Dejar vacío para el usuario actual"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Si es bibliotecario, ingrese el ID del alumno/docente para quien reserva.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Observaciones */}
                            <FormField
                                control={formReservation.control}
                                name="observation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notas / Motivo de Reserva</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ej: Requiere para trabajo de investigación de la asignatura..."
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 flex justify-end gap-2 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled className="gap-2">
                                    <FaRegSave className="size-4" />
                                    {loading ? "Guardando..." : "Confirmar Reserva"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
