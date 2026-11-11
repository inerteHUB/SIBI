"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading";
import { ArrowLeft, FileText, Download, GraduationCap } from "lucide-react";
import { apiBackend } from "@/config/constants";
import { useLandingThesisPreDetail } from "../useLandingThesisPre";
import { UserPublic } from "../typeLandingThesisPre";

function userName(u?: UserPublic) {
    if (!u) return "-";
    return [u.name, u.last_name, u.paternal_surname, u.maternal_surname].filter(Boolean).join(" ");
}

export default function LandingThesisPreDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const thesisId = Number(searchParams.get("id"));

    const { thesis, fetchThesis, loading } = useLandingThesisPreDetail();

    useEffect(() => {
        if (thesisId) fetchThesis(thesisId);
    }, [thesisId]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            {/* Volver */}
            <button
                onClick={() => router.push("/landing/search")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="size-4" /> Volver a la búsqueda
            </button>

            {!thesisId ? (
                <p className="text-sm text-muted-foreground text-center py-20">
                    No se especificó ninguna tesis.
                </p>
            ) : loading ? (
                <div className="flex justify-center py-20"><LoadingSpinner /></div>
            ) : !thesis ? (
                <div className="text-center py-20 space-y-2">
                    <GraduationCap className="size-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        No se encontró la tesis o no está disponible públicamente.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Encabezado */}
                    <div className="space-y-2">
                        <Badge variant="secondary">{thesis.process}</Badge>
                        <h1 className="text-xl font-bold">{thesis.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge>{thesis.state}</Badge>
                            <span>•</span>
                            <span>{new Date(thesis.created_at).getFullYear()}</span>
                        </div>
                    </div>

                    {/* Línea de investigación */}
                    {thesis.research_line && (
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Línea de investigación</p>
                            <p className="text-sm font-medium">{thesis.research_line}</p>
                        </div>
                    )}

                    {/* Autores */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
                            Autores
                        </p>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Autor principal</p>
                                <p className="text-sm font-medium">{userName(thesis.author_one)}</p>
                            </div>
                            {thesis.author_two && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Segundo autor</p>
                                    <p className="text-sm font-medium">{userName(thesis.author_two)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Asesoría */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
                            Asesoría
                        </p>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Asesor</p>
                                <p className="text-sm font-medium">{userName(thesis.advisor)}</p>
                            </div>
                            {thesis.co_advisor && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Co-Asesor</p>
                                    <p className="text-sm font-medium">{userName(thesis.co_advisor)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Jurado */}
                    {thesis.examiners.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
                                Jurado
                            </p>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                {thesis.examiners.map((e) => (
                                    <div key={e.id}>
                                        <p className="text-sm">{userName(e.examiner)}</p>
                                        <Badge variant="secondary" className="text-[10px]">{e.role}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resoluciones */}
                    {thesis.resolutions.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
                                Resoluciones
                            </p>
                            {thesis.resolutions.map((r) => (
                                <div key={r.id} className="text-sm space-y-0.5 border-l-2 pl-3">
                                    <p className="font-medium">{r.resolution_number}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {r.resolution_type} — {new Date(r.resolution_date).toLocaleDateString("es-PE")}
                                    </p>
                                    {r.file_path && (
                                        <a
                                            href={`${apiBackend}/${r.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                            <Download className="size-3" /> Ver documento
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Archivos / descargas */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
                            Documentos
                        </p>
                        {thesis.files
                            .filter((f) => f.is_active === "Activo")
                            .map((f) => (
                                <a
                                    key={f.id}
                                    href={`${apiBackend}/${f.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={f.original_name}
                                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="size-4 text-muted-foreground shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium truncate">{f.original_name}</p>
                                            <p className="text-[10px] text-muted-foreground">{f.category}</p>
                                        </div>
                                    </div>
                                    <Download className="size-4 text-muted-foreground shrink-0" />
                                </a>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}