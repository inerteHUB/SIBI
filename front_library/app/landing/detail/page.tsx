"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading";
import { ArrowLeft, ArrowUpRight, BookOpen, Download, FileText, GraduationCap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { apiBackend } from "@/config/constants";
import { useLandingThesisPreDetail } from "../useLandingThesisPre";
import { UserPublic } from "../typeLandingThesisPre";

function userName(u?: UserPublic) {
    if (!u) return "-";
    return [u.name, u.last_name, u.paternal_surname, u.maternal_surname].filter(Boolean).join(" ");
}

export default function LandingThesisPreDetailPage() {
    const searchParams = useSearchParams();
    const thesisId = Number(searchParams.get("id"));

    const { thesis, fetchThesis, loading } = useLandingThesisPreDetail();

    useEffect(() => {
        if (thesisId) fetchThesis(thesisId);
    }, [fetchThesis, thesisId]);

    return (
        <main className="min-h-svh bg-background text-foreground">
            <header className="border-b border-border/70 bg-background/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" aria-label="SIBI, inicio" className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <BookOpen aria-hidden="true" />
                        </span>
                        <span className="flex flex-col leading-tight">
                            <span className="font-semibold tracking-[0.14em]">SIBI</span>
                            <span className="text-xs text-muted-foreground">Repositorio académico · UNSM</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button asChild size="sm" variant="outline"><Link href="/landing/search">Repositorio</Link></Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <Link href="/landing/search" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <ArrowLeft aria-hidden="true" /> Volver a la búsqueda
                </Link>

                {!thesisId ? (
                    <section className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center" role="status">
                        <GraduationCap aria-hidden="true" className="mx-auto text-primary" />
                        <h1 className="mt-4 font-landing-display text-3xl">Ficha académica</h1>
                        <p className="mt-2 text-sm text-muted-foreground">No se especificó ninguna tesis.</p>
                    </section>
                ) : loading ? (
                    <div className="flex min-h-96 items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
                        <LoadingSpinner /> Consultando la ficha académica…
                    </div>
                ) : !thesis ? (
                    <section className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center" role="status">
                        <GraduationCap aria-hidden="true" className="mx-auto text-muted-foreground" />
                        <h1 className="mt-4 font-landing-display text-3xl">Registro no disponible</h1>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            No se encontró la tesis o no está disponible públicamente.
                        </p>
                    </section>
                ) : (
                    <article className="mt-8 flex flex-col gap-6">
                        <header className="relative overflow-hidden rounded-3xl bg-brand-ink p-6 text-brand-paper shadow-xl sm:p-10">
                            <div aria-hidden="true" className="landing-seal-pattern pointer-events-none absolute inset-0" />
                            <div className="relative">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className="border-brand-paper/30 bg-brand-paper/10 text-brand-paper">{thesis.process}</Badge>
                                    <Badge variant="secondary">{thesis.state}</Badge>
                                </div>
                                <h1 className="mt-5 max-w-4xl font-landing-display text-3xl leading-tight tracking-tight sm:text-5xl">{thesis.title}</h1>
                                <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-brand-paper/65">
                                    Universidad Nacional de San Martín · {new Date(thesis.created_at).getFullYear()}
                                </p>
                            </div>
                        </header>

                        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                            <section aria-labelledby="authors-title" className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7">
                                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">Personas</p>
                                <h2 id="authors-title" className="mt-2 font-landing-display text-2xl">Autores y asesoría</h2>
                                <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <div><dt className="text-xs text-muted-foreground">Autor principal</dt><dd className="mt-1 font-medium">{userName(thesis.author_one)}</dd></div>
                                    {thesis.author_two && <div><dt className="text-xs text-muted-foreground">Segundo autor</dt><dd className="mt-1 font-medium">{userName(thesis.author_two)}</dd></div>}
                                    <div><dt className="text-xs text-muted-foreground">Asesor</dt><dd className="mt-1 font-medium">{userName(thesis.advisor)}</dd></div>
                                    {thesis.co_advisor && <div><dt className="text-xs text-muted-foreground">Coasesor</dt><dd className="mt-1 font-medium">{userName(thesis.co_advisor)}</dd></div>}
                                </dl>
                                {thesis.research_line && (
                                    <div className="mt-6 border-t border-border pt-5">
                                        <p className="text-xs text-muted-foreground">Línea de investigación</p>
                                        <p className="mt-1 font-medium">{thesis.research_line}</p>
                                    </div>
                                )}
                            </section>

                            <section aria-labelledby="examiners-title" className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7">
                                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">Evaluación</p>
                                <h2 id="examiners-title" className="mt-2 font-landing-display text-2xl">Jurado</h2>
                                {thesis.examiners.length > 0 ? (
                                    <ul className="mt-5 flex flex-col gap-4">
                                        {thesis.examiners.map((examiner) => (
                                            <li key={examiner.id} className="flex items-start justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
                                                <span className="text-sm font-medium">{userName(examiner.examiner)}</span>
                                                <Badge variant="secondary" className="shrink-0">{examiner.role}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-5 text-sm text-muted-foreground">No se registró información del jurado.</p>
                                )}
                            </section>
                        </div>

                        <section aria-labelledby="documents-title" className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7">
                            <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">Resoluciones y archivos</p>
                                    <h2 id="documents-title" className="mt-2 font-landing-display text-2xl">Documentos</h2>
                                </div>
                                <p className="text-xs text-muted-foreground">Archivos publicados para consulta</p>
                            </div>

                            {thesis.resolutions.length > 0 && (
                                <div className="mt-5 flex flex-col gap-3">
                                    {thesis.resolutions.map((resolution) => (
                                        <div key={resolution.id} className="flex flex-col gap-2 rounded-xl border border-border/70 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-medium">{resolution.resolution_number}</p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {resolution.resolution_type} · {new Date(resolution.resolution_date).toLocaleDateString("es-PE")}
                                                </p>
                                            </div>
                                            {resolution.file_path && (
                                                <a href={`${apiBackend}/${resolution.file_path}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                                    Ver resolución <ArrowUpRight aria-hidden="true" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 flex flex-col gap-3">
                                {thesis.files.filter((file) => file.is_active === "Activo").map((file) => (
                                    <a key={file.id} href={`${apiBackend}/${file.file_path}`} target="_blank" rel="noopener noreferrer" download={file.original_name} className="flex items-center justify-between gap-4 rounded-xl border border-border/70 p-4 transition-colors hover:bg-muted/50">
                                        <span className="flex min-w-0 items-center gap-3">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"><FileText aria-hidden="true" /></span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium">{file.original_name}</span>
                                                <span className="mt-1 block text-xs text-muted-foreground">{file.category}</span>
                                            </span>
                                        </span>
                                        <Download aria-hidden="true" className="shrink-0 text-muted-foreground" />
                                    </a>
                                ))}
                                {thesis.files.filter((file) => file.is_active === "Activo").length === 0 && thesis.resolutions.length === 0 && (
                                    <p className="py-5 text-sm text-muted-foreground">No hay documentos publicados para este registro.</p>
                                )}
                            </div>
                        </section>
                    </article>
                )}
            </div>

            <footer className="border-t border-border/70 bg-card">
                <div className="mx-auto flex max-w-7xl justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
                    <span className="font-semibold tracking-[0.12em] text-foreground">SIBI · UNSM</span>
                    <Link href="/">Volver al inicio</Link>
                </div>
            </footer>
        </main>
    );
}
