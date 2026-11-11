"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDependencyEdit, DependencyEditForm } from "../hooks/useDependencyEdit";
import { DependencyList } from "../type/typeDependencyList";
import { DependencyForm } from "../type/typeDependencyForm";
import { apiBackend } from "@/config/constants";
import { UseFormReturn } from "react-hook-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dependency: DependencyList | null;
    refreshDependencies: () => void;
    formData: DependencyForm;
};

function ImagePickerEdit({
    label, fieldName, removeFieldName, formDependency, initialUrl,
}: {
    label: string;
    fieldName: "logo" | "stamp";
    removeFieldName: "remove_logo" | "remove_stamp";
    formDependency: UseFormReturn<DependencyEditForm>;
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
        formDependency.setValue(fieldName, file, { shouldValidate: true });
        formDependency.setValue(removeFieldName, false);
        setPreview(file?.type === "image/png" ? URL.createObjectURL(file) : null);
    };

    const handleRemove = () => {
        formDependency.setValue(fieldName, null);
        formDependency.setValue(removeFieldName, true);
        setPreview(null);
        if (ref.current) ref.current.value = "";
    };

    return (
        <FormField
            control={formDependency.control}
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

export default function UiDependencyEdit({ open, onOpenChange, dependency, refreshDependencies, formData }: Props) {
    const { formDependency, editDependency, loading } = useDependencyEdit(
        dependency?.id ?? 0,
        () => { refreshDependencies(); onOpenChange(false); }
    );

    useEffect(() => {
        if (dependency && open) {
            formDependency.reset({
                name:         dependency.name,
                abbreviation: dependency.abbreviation,
                faculty_id:   dependency.faculty_id,
                logo: null, stamp: null,
                remove_logo: false, remove_stamp: false,
            });
        }
        if (!open) {
            formDependency.reset();
        }
    }, [dependency, open]);

    const logoUrl  = dependency?.logo  ? `${apiBackend}/${dependency.logo}`  : null;
    const stampUrl = dependency?.stamp ? `${apiBackend}/${dependency.stamp}` : null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Editar Dependencia</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formDependency}>
                        <form onSubmit={formDependency.handleSubmit(editDependency)} className="space-y-4">
                            <FormField
                                control={formDependency.control}
                                name="faculty_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facultad <span className="text-destructive">*</span></FormLabel>
                                        <Select
                                            onValueChange={(v) => field.onChange(Number(v))}
                                            value={field.value > 0 ? String(field.value) : ""}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar facultad" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {formData.faculties.map((f) => (
                                                    <SelectItem key={f.id} value={String(f.id)}>
                                                        {f.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formDependency.control}
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
                                control={formDependency.control}
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
                                formDependency={formDependency} initialUrl={open ? logoUrl : null}
                            />
                            <ImagePickerEdit
                                label="Sello" fieldName="stamp" removeFieldName="remove_stamp"
                                formDependency={formDependency} initialUrl={open ? stampUrl : null}
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