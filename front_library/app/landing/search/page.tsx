"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input }  from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading";
import { Search, FileText, GraduationCap } from "lucide-react";
import { useLandingThesisPreSearch } from "../useLandingThesisPre";

function userName(u?: { name: string; last_name?: string; paternal_surname: string; maternal_surname?: string }) {
    if (!u) return "-";
    return [u.name, u.last_name, u.paternal_surname, u.maternal_surname].filter(Boolean).join(" ");
}

export default function LandingThesisPreSearchPage() {
    const router = useRouter();
    const [q, setQ] = useState("");
    const { results, total, loading, searched, search } = useLandingThesisPreSearch();

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        search(q);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            {/* Encabezado */}
            <div className="text-center space-y-2">
                <GraduationCap className="size-10 mx-auto text-primary" />
                <h1 className="text-2xl font-bold">Repositorio de Tesis</h1>
                <p className="text-sm text-muted-foreground">
                    Busca trabajos de investigación por DNI del autor, nombre o título de la tesis.
                </p>
            </div>

            {/* Buscador */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    placeholder="Ej. 71234567, Juan Pérez, o título de la tesis..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                    <Search className="size-4 mr-1" />
                    {loading ? "Buscando..." : "Buscar"}
                </Button>
            </form>

            {/* Resultados */}
            {loading && (
                <div className="flex justify-center py-10"><LoadingSpinner /></div>
            )}

            {!loading && searched && (
                <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                        {total} resultado{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
                    </p>

                    {results.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-10">
                            No se encontraron tesis con ese criterio de búsqueda.
                        </p>
                    ) : (
                        results.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => router.push(`/landing/detail?id=${r.id}`)}
                                className="w-full text-left rounded-lg border p-4 hover:bg-muted/50 transition-colors space-y-1"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-medium text-sm">{r.title}</p>
                                    <Badge variant="secondary" className="shrink-0">{r.state}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FileText className="size-3" />
                                    {userName(r.author_one)}
                                    {r.author_two && ` • ${userName(r.author_two)}`}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    {r.process} — {new Date(r.created_at).getFullYear()}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}