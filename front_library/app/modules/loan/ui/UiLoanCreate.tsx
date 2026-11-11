"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoIosAddCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { Trash2, Plus } from "lucide-react";
import { useLoanCreate } from "../hooks/useLoanCreate";

interface Props {
    refreshLoans: () => void;
}

export default function UiLoanCreate({ refreshLoans }: Props) {
    const [open, setOpen] = useState(false);
    const { formLoan, fieldArray, loading } = useLoanCreate(() => {
        refreshLoans();
        setOpen(false);
    });

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) formLoan.reset();
        setOpen(isOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                    <IoIosAddCircle className="size-4" /> Registrar Préstamo
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-xl border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-3">Registrar Nuevo Préstamo</SheetTitle>
                </SheetHeader>

                <div className="py-4">
                    <Form {...formLoan}>
                        <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
                            {/* Datos del Prestatario */}
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={formLoan.control}
                                    name="user_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID del Lector <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ej: 1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={formLoan.control}
                                    name="loan_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Préstamo <span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Domicilio">A Domicilio</SelectItem>
                                                    <SelectItem value="Sala">En Sala (Lectura interna)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={formLoan.control}
                                name="days"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Días de Préstamo <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="number" min={1} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Alerta de dependencia con módulo Libros */}
                            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200" role="status">
                                <p className="font-semibold">Selección de ejemplares no disponible</p>
                                <p className="mt-1 text-xs leading-relaxed">
                                    La OpenAPI no publica un catálogo de libros o ejemplares. Para evitar registrar préstamos con identificadores inventados, esta operación queda deshabilitada hasta contar con ese contrato.
                                </p>
                            </div>

                            {/* Lista de Ejemplares */}
                            <div className="border rounded-lg p-3 space-y-3 bg-muted/20">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-sm font-semibold">Ejemplares a Prestar</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1 text-xs"
                                        disabled
                                        onClick={() => fieldArray.append({
                                            copy_id: "" as unknown as number,
                                            title: "",
                                            copy_code: "",
                                            initial_condition: "Bueno",
                                            notes: "",
                                        })}
                                    >
                                        <Plus className="size-3" /> Agregar libro
                                    </Button>
                                </div>

                                {fieldArray.fields.map((item, index) => (
                                    <div key={item.id} className="border rounded-md p-3 space-y-2 bg-background relative">
                                        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                                            <span>Libro #{index + 1}</span>
                                            {fieldArray.fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 text-destructive"
                                                    onClick={() => fieldArray.remove(index)}
                                                >
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <FormField
                                                control={formLoan.control}
                                                name={`details.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel className="text-xs">Título del Libro <span className="text-destructive">*</span></FormLabel>
                                                        <FormControl>
                                                            <Input className="h-8 text-xs" placeholder="Disponible cuando exista el catálogo" {...field} disabled />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={formLoan.control}
                                                name={`details.${index}.copy_id`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">ID Copia</FormLabel>
                                                        <FormControl>
                                                            <Input className="h-8 text-xs" type="number" placeholder="Sin contrato de catálogo" {...field} disabled />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <FormField
                                                control={formLoan.control}
                                                name={`details.${index}.copy_code`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Cód. Patrimonial / Barras</FormLabel>
                                                        <FormControl>
                                                            <Input className="h-8 text-xs" placeholder="Sin contrato de catálogo" {...field} disabled />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={formLoan.control}
                                                name={`details.${index}.initial_condition`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Estado Físico</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined} disabled>
                                                            <FormControl>
                                                                <SelectTrigger className="h-8 text-xs">
<SelectValue placeholder="Sin dato de catálogo" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Bueno">Bueno</SelectItem>
                                                                <SelectItem value="Regular">Regular</SelectItem>
                                                                <SelectItem value="Nuevo">Nuevo</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <FormField
                                control={formLoan.control}
                                name="observation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observaciones adicionales</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Notas especiales de préstamo..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-between items-center pt-4">
                                <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
                                    <IoMdCloseCircleOutline className="size-5" /> Cancelar
                                </Button>
                                <Button type="submit" disabled className="gap-2">
                                    <FaRegSave className="size-4" /> {loading ? "Guardando..." : "Guardar Préstamo"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
