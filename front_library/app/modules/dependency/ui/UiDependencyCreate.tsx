"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaRegSave } from "react-icons/fa";
import { IoIosAddCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { useDependencyCreate, DependencyCreateForm } from "../hooks/useDependencyCreate";
import { DependencyForm } from "../type/typeDependencyForm";
import { UseFormReturn } from "react-hook-form";

type Props = {
    refreshDependencies: () => void;
    formData: DependencyForm;
    fetchFormData: () => Promise<void>;
};

function ImagePicker({
    label, fieldName, formDependency,
}: {
    label: string;
    fieldName: "logo" | "stamp";
    formDependency: UseFormReturn<DependencyCreateForm>;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        formDependency.setValue(fieldName, file, { shouldValidate: true });
        setPreview(file?.type === "image/png" ? URL.createObjectURL(file) : null);
    };

    const handleRemove = () => {
        formDependency.setValue(fieldName, null);
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

export default function UiDependencyCreate({ refreshDependencies, formData, fetchFormData }: Props) {
    const { formDependency, createDependency, loading } = useDependencyCreate(refreshDependencies);
    const [open, setOpen] = useState(false);

    const handleOpenChange = async (isOpen: boolean) => {
        if (isOpen) {
            await fetchFormData();
        } else {
            formDependency.reset();
        }
        setOpen(isOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                    <IoIosAddCircle className="h-4 w-4" />
                    <span>Registrar</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Registrar Dependencia</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formDependency}>
                        <form onSubmit={formDependency.handleSubmit(createDependency)} className="space-y-4">
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
                            <ImagePicker label="Logo"  fieldName="logo"  formDependency={formDependency} />
                            <ImagePicker label="Sello" fieldName="stamp" formDependency={formDependency} />
                            <div className="flex justify-between items-center mt-8">
                                <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
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