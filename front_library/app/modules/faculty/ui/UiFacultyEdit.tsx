"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useFacultyEdit, FacultyEditForm } from "../hooks/useFacultyEdit";
import { FacultyList } from "../type/typeFacultyList";
import { apiBackend } from "@/config/constants";
import { UseFormReturn } from "react-hook-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faculty: FacultyList | null;
    refreshFaculties: () => void;
};

function ImagePickerEdit({
    label,
    fieldName,
    removeFieldName,
    formFaculty,
    initialUrl,
}: {
    label: string;
    fieldName: "logo" | "stamp";
    removeFieldName: "remove_logo" | "remove_stamp";
    formFaculty: UseFormReturn<FacultyEditForm>;
    initialUrl: string | null;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(initialUrl);

    useEffect(() => {
        setPreview(initialUrl);
        if (ref.current) ref.current.value = "";
    }, [initialUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        formFaculty.setValue(fieldName, file, { shouldValidate: true });
        formFaculty.setValue(removeFieldName, false);
        setPreview(file?.type === "image/png" ? URL.createObjectURL(file) : null);
    };

    const handleRemove = () => {
        formFaculty.setValue(fieldName, null);
        formFaculty.setValue(removeFieldName, true);
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

export default function UiFacultyEdit({ open, onOpenChange, faculty, refreshFaculties }: Props) {
    const { formFaculty, editFaculty, loading } = useFacultyEdit(
        faculty?.id ?? 0,
        () => { refreshFaculties(); onOpenChange(false); }
    );

    useEffect(() => {
        if (faculty && open) {
            formFaculty.reset({
                name: faculty.name,
                abbreviation: faculty.abbreviation,
                logo: null, stamp: null,
                remove_logo: false, remove_stamp: false,
            });
        }
    }, [faculty, open]);

    const logoUrl  = faculty?.logo  ? `${apiBackend}/${faculty.logo}`  : null;
    const stampUrl = faculty?.stamp ? `${apiBackend}/${faculty.stamp}` : null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Editar Facultad</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formFaculty}>
                        <form onSubmit={formFaculty.handleSubmit(editFaculty)} className="space-y-4">
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
                            <ImagePickerEdit
                                label="Logo" fieldName="logo" removeFieldName="remove_logo"
                                formFaculty={formFaculty} initialUrl={open ? logoUrl : null}
                            />
                            <ImagePickerEdit
                                label="Sello" fieldName="stamp" removeFieldName="remove_stamp"
                                formFaculty={formFaculty} initialUrl={open ? stampUrl : null}
                            />
                            <div className="flex justify-between items-center mt-8">
                                <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
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