"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, FileCheck, X, UploadCloud, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiBackend } from "@/config/constants";
import { ExistingFile } from "@/app/modules/thesis-pre/form/typeThesisPreForm";

type Props = {
    value?:         File | null;
    onChange:       (file: File | undefined) => void;
    isEdit?:        boolean;
    existingFile?:  ExistingFile;
};

const WORD_MIME_TYPES = {
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

export function WordDropzone({ value, onChange, isEdit = false, existingFile }: Props) {
    const [replacing, setReplacing] = useState(false);

    const onDrop = useCallback((accepted: File[]) => {
        if (accepted[0]) onChange(accepted[0]);
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: WORD_MIME_TYPES,
        maxFiles: 1,
        multiple: false,
    });

    const handleCancel = () => {
        setReplacing(false);
        onChange(undefined);
    };

    // Nuevo archivo seleccionado
    if (value) {
        return (
            <div className="flex h-14 w-full items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4">
                <FileText className="size-7 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{value.name}</p>
                    <p className="text-xs text-muted-foreground">{(value.size / 1024).toFixed(0)} KB · Word</p>
                </div>
                <button
                    type="button"
                    onClick={() => { onChange(undefined); setReplacing(false); }}
                    className="rounded-full p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive-base transition-colors shrink-0"
                    aria-label="Quitar archivo"
                >
                    <X className="size-4" />
                </button>
            </div>
        );
    }

    // Archivo existente (modo edit, no está reemplazando)
    if (existingFile && !replacing) {
        return (
            <div className="flex h-14 w-full items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4">
                <FileCheck className="size-7 text-success-base shrink-0" />
                <a 
                    href={`${apiBackend}/${existingFile.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 text-sm font-medium text-primary hover:underline truncate"
                >
                    {existingFile.original_name}
                </a>
                <button
                    type="button"
                    onClick={() => setReplacing(true)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                    <RefreshCw className="size-3.5" /> Reemplazar
                </button>
            </div>
        );
    }

    // Zona de drop (vacía o en modo reemplazo)
    return (
        <div className="space-y-1.5">
            {replacing && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="size-3" /> Cancelar reemplazo
                    </button>
                </div>
            )}
            <div
                {...getRootProps()}
                className={cn(
                    "flex h-14 w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4",
                    "cursor-pointer transition-colors text-center",
                    isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
                )}
            >
                <input {...getInputProps()} />
                <UploadCloud className={cn("size-6 transition-colors mr-4", isDragActive ? "text-primary" : "text-muted-foreground/50")} />
                <p className="text-sm font-medium mr-2">
                    Arrastra tu Word aquí o{" "}
                    <span className="text-primary underline underline-offset-2">selecciona un archivo</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {isEdit ? "Opcional · si no subes uno nuevo se conserva el actual" : "Formatos .doc, .docx · Requerido"}
                </p>
            </div>
        </div>
    );
}