"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, GraduationCap, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading";
import { ModeToggle } from "@/components/mode-toggle";
import { useLandingThesisPreSearch } from "../useLandingThesisPre";

function userName(u?: { name: string; last_name?: string; paternal_surname: string; maternal_surname?: string }) {
    if (!u) return "-";
    return [u.name, u.last_name, u.paternal_surname, u.maternal_surname].filter(Boolean).join(" ");
}

export default function LandingThesisPreSearchPage() {
    const [q, setQ] = useState("");
    const { results, total, loading, searched, search } = useLandingThesisPreSearch();

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        search(q);
    };

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
                        <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
                            <Link href="/auth/login">Acceso institucional</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <section aria-labelledby="repository-title" className="bg-brand-ink text-brand-paper">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:px-8 lg:py-20">
                    <div>
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-paper/70">
                            <GraduationCap aria-hidden="true" /> Memoria académica
                        </p>
                        <h1 id="repository-title" className="mt-4 max-w-xl font-landing-display text-4xl leading-tight tracking-tight sm:text-5xl">
                            Repositorio de investigación
                        </h1>
                        <p className="mt-4 max-w-lg text-sm leading-6 text-brand-paper/75 sm:text-base">
                            Explora tesis y trabajos de investigación publicados por la comunidad universitaria.
                        </p>
                    </div>

                    <form aria-label="Buscar en el repositorio académico" onSubmit={handleSearch} className="flex flex-col gap-3 rounded-2xl border border-brand-paper/15 bg-brand-paper/10 p-3 backdrop-blur-sm sm:flex-row">
                        <label className="sr-only" htmlFor="repository-search">Buscar por autor, documento o título</label>
                        <div className="relative flex-1">
                            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="repository-search"
                                autoComplete="off"
                                placeholder="Autor, documento o título"
                                value={q}
                                onChange={(event) => setQ(event.target.value)}
                                className="h-12 border-0 bg-background pl-11 shadow-none"
                            />
                        </div>
                        <Button className="h-12 sm:px-6" disabled={loading} type="submit">
                            <Search aria-hidden="true" data-icon="inline-start" />
                            {loading ? "Buscando…" : "Buscar"}
                        </Button>
                    </form>
                </div>
            </section>

            <section aria-live="polite" aria-label="Resultados del repositorio" className="mx-auto min-h-[22rem] max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                {loading ? (
                    <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
                        <LoadingSpinner />
                        Consultando el repositorio…
                    </div>
                ) : searched ? (
                    <>
                        <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">Búsqueda pública</p>
                                <h2 className="mt-2 font-landing-display text-3xl">Resultados</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {total} resultado{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
                            </p>
                        </div>

                        {results.length === 0 ? (
                            <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 text-center">
                                <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                                    <BookOpen aria-hidden="true" />
                                </span>
                                <h3 className="font-landing-display text-2xl">No encontramos coincidencias</h3>
                                <p className="max-w-md text-sm leading-6 text-muted-foreground">Prueba con otro título, nombre de autor o número de documento.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {results.map((result) => (
                                    <Link key={result.id} href={`/landing/detail?id=${result.id}`} className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                        <article className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                                                        <FileText aria-hidden="true" />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <h3 className="font-landing-display text-xl leading-snug sm:text-2xl">{result.title}</h3>
                                                        <p className="mt-2 text-sm text-muted-foreground">{userName(result.author_one)}{result.author_two ? ` · ${userName(result.author_two)}` : ""}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="shrink-0">{result.state}</Badge>
                                            </div>
                                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                                                <span>{result.process} · {new Date(result.created_at).getFullYear()}</span>
                                                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                                                    Ver ficha
                                                    <ArrowUpRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 text-center">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                            <Search aria-hidden="true" />
                        </span>
                        <h2 className="font-landing-display text-2xl">Empieza tu búsqueda</h2>
                        <p className="max-w-md text-sm leading-6 text-muted-foreground">Ingresa un autor, número de documento o parte del título para consultar los registros disponibles.</p>
                    </div>
                )}
            </section>

            <footer className="border-t border-border/70 bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
                    <span className="font-semibold tracking-[0.12em] text-foreground">SIBI · UNSM</span>
                    <Link href="/" className="hover:text-foreground">Volver al inicio</Link>
                </div>
            </footer>
        </main>
    );
}
