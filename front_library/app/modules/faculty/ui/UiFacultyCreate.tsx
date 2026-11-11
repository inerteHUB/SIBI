"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FaRegSave } from "react-icons/fa";
import { IoIosAddCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { useFacultyCreate } from "../hooks/useFacultyCreate";

type Props = { refreshFaculties: () => void };

function ImagePicker({
    label, fieldName, formFaculty,
}: {
    label: string;
    fieldName: "logo" | "stamp";
    formFaculty: ReturnType<typeof useFacultyCreate>["formFaculty"];
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        formFaculty.setValue(fieldName, file, { shouldValidate: true });
        setPreview(file?.type === "image/png" ? URL.createObjectURL(file) : null);
    };

    const handleRemove = () => {
        formFaculty.setValue(fieldName, null);
        setPreview(null);
        if (ref.current) ref.current.value = "";
    };

    return (
        <FormField
            control={formFaculty.control}
            name={fieldName}
            render={() => (
                <FormItem>
                    <FormLabel>{label} (PNG)</FormLabel>
                    <FormControl>
                        <div>
                            <div className="flex justify-center items-center gap-4">
                                <Button type="button" variant="outline" onClick={() => ref.current?.click()}>
                                    Seleccionar imagen
                                </Button>
                                {preview && (
                                    <Button type="button" variant="outlineDestructive" onClick={handleRemove}>
                                        Quitar
                                    </Button>
                                )}
                                <input ref={ref} type="file" accept="image/png" className="hidden" onChange={handleChange} />
                            </div>
                            <div className="flex justify-center mt-4">
                                {preview ? (
                                    <img src={preview} alt={`Preview ${label}`} className="h-20 w-20 rounded border object-contain" />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">PNG</div>
                                )}
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default function UiFacultyCreate({ refreshFaculties }: Props) {
    const { formFaculty, createFaculty, loading } = useFacultyCreate(refreshFaculties);
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                    <IoIosAddCircle className="h-4 w-4" />
                    <span>Registrar</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Registrar Facultad</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formFaculty}>
                        <form onSubmit={formFaculty.handleSubmit(createFaculty)} className="space-y-4">
                            <FormField
                                control={formFaculty.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre <span className="text-destructive">*</span></FormLabel>
                                        <FormControl><Input autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formFaculty.control}
                                name="abbreviation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Abreviatura <span className="text-destructive">*</span></FormLabel>
                                        <FormControl><Input autoComplete="off" maxLength={20} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <ImagePicker label="Logo"  fieldName="logo"  formFaculty={formFaculty} />
                            <ImagePicker label="Sello" fieldName="stamp" formFaculty={formFaculty} />
                            <div className="flex justify-between items-center mt-8">
                                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                    <IoMdCloseCircleOutline className="size-5" /> Cerrar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    <FaRegSave />
                                    {loading ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}