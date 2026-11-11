"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingText } from "@/components/loading";
import { formatDateTime } from "@/lib/utils";
import { FaBook, FaClock, FaEye, FaUndo, FaCalendarPlus } from "react-icons/fa";

import { Loan } from "../type/typeLoanBase";
import { useLoanView } from "../hooks/useLoanView";

import UiLoanCreate from "./UiLoanCreate";
import UiLoanView   from "./UiLoanView";
import UiLoanReturn from "./UiLoanReturn";
import UiLoanRenew  from "./UiLoanRenew";
import { UiSatisfactionSubmit } from "../../satisfaction/ui/UiSatisfactionSubmit";

interface Props {
    loans: Loan[];
    loadingLoans: boolean;
    errorLoans: string | null;
    refreshLoans: () => void;
}

export default function UiLoanList({ loans, loadingLoans, errorLoans, refreshLoans }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("TODOS");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [openView, setOpenView]     = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [openRenew, setOpenRenew]   = useState(false);
    const [openSurvey, setOpenSurvey] = useState(false);
    const [surveyLoanId, setSurveyLoanId] = useState<number | null>(null);

    const { loan: selectedLoanDetail, fetchLoan } = useLoanView();

    const selectedLoan = loans.find((l) => l.id === selectedId) ?? null;

    const handleRowClick = (id: number) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };

    const handleView = async () => {
        if (!selectedId) return;
        await fetchLoan(selectedId);
        setOpenView(true);
    };

    const handleReturn = async () => {
        if (!selectedId) return;
        await fetchLoan(selectedId);
        setOpenReturn(true);
    };

    const handleRenew = async () => {
        if (!selectedId) return;
        await fetchLoan(selectedId);
        setOpenRenew(true);
    };

    // Filtros locales
    const filteredLoans = loans.filter((l) => {
        const matchesStatus = statusFilter === "TODOS" || l.status === statusFilter || (statusFilter === "Vencido" && l.is_overdue && l.status !== "Devuelto");
        const matchesSearch = searchTerm === "" ||
            l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.user?.full_name && l.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (l.user?.dni && l.user.dni.includes(searchTerm));
        return matchesStatus && matchesSearch;
    });

    const circulationCount = loans.filter((loan) => loan.status !== "Devuelto").length;
    const overdueCount = loans.filter((loan) => loan.is_overdue && loan.status !== "Devuelto").length;
    const returnedCount = loans.filter((loan) => loan.status === "Devuelto").length;

    if (loadingLoans && loans.length === 0) return <LoadingText />;
    if (errorLoans) return <p className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 font-medium text-destructive" role="alert">{errorLoans}</p>;

    return (
        <div className="flex flex-col gap-5">
            <section aria-label="Resumen de circulación" className="grid gap-3 sm:grid-cols-3">
                {[
                    { label: "En circulación", value: circulationCount, note: "Préstamos sin devolución registrada", icon: FaBook },
                    { label: "Con atraso", value: overdueCount, note: "Requieren seguimiento", icon: FaClock },
                    { label: "Devueltos", value: returnedCount, note: "Devoluciones registradas", icon: FaUndo },
                ].map(({ label, value, note, icon: Icon }) => (
                    <article key={label} className="rounded-2xl border border-border/80 border-t-2 border-t-primary bg-card p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                                <p className="mt-2 font-landing-display text-4xl leading-none">{value}</p>
                            </div>
                            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                                <Icon aria-hidden="true" />
                            </span>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">{note}</p>
                    </article>
                ))}
            </section>

            <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm lg:p-5">
                <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                <div className="flex flex-wrap gap-2 items-center">
                    <UiLoanCreate refreshLoans={refreshLoans} />
                    
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId}
                        onClick={handleView}
                        className="gap-2"
                    >
                        <FaEye aria-hidden="true" data-icon="inline-start" /> Ver detalle
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || selectedLoan?.status === "Devuelto"}
                        onClick={handleReturn}
                        className="gap-2 text-primary"
                    >
                        <FaUndo aria-hidden="true" data-icon="inline-start" /> Registrar devolución
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || selectedLoan?.status === "Devuelto" || selectedLoan?.is_overdue}
                        onClick={handleRenew}
                        className="gap-2 text-secondary-foreground"
                    >
                        <FaCalendarPlus aria-hidden="true" data-icon="inline-start" /> Renovar préstamo
                    </Button>
                    <p aria-live="polite" className="min-h-8 self-center text-xs text-muted-foreground">
                        {selectedLoan ? `Seleccionado: ${selectedLoan.code}` : "Selecciona una fila para habilitar las acciones."}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                    <label className="sr-only" htmlFor="loan-search">Buscar préstamos</label>
                    <Input
                        id="loan-search"
                        aria-label="Buscar por código, lector o DNI"
                        placeholder="Buscar por código, lector o DNI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 h-9 text-xs"
                    />

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger aria-label="Filtrar préstamos por estado" className="w-40 h-10 text-sm">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODOS">Todos</SelectItem>
                            <SelectItem value="Activo">Activos</SelectItem>
                            <SelectItem value="Renovado">Renovados</SelectItem>
                            <SelectItem value="Vencido">Vencidos</SelectItem>
                            <SelectItem value="Devuelto">Devueltos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                </div>
            </div>

            {/* Tabla de préstamos */}
            <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Lector</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>F. Préstamo</TableHead>
                            <TableHead>F. Vencimiento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-center">Libros</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLoans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-28 text-center text-muted-foreground text-sm">
                                    No se encontraron registros de préstamos.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLoans.map((l, index) => {
                                const isSelected = l.id === selectedId;
                                const isOverdue = l.is_overdue && l.status !== "Devuelto";

                                return (
                                    <TableRow
                                        key={l.id}
                                        onClick={() => handleRowClick(l.id)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                handleRowClick(l.id);
                                            }
                                        }}
                                        aria-selected={isSelected}
                                        tabIndex={0}
                                        className={`cursor-pointer transition-colors text-xs focus-visible:outline-2 focus-visible:outline-ring md:text-sm ${
                                            isSelected ? "bg-accent/70" : "hover:bg-muted/70"
                                        }`}
                                    >
                                        <TableCell className="text-center font-mono text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-semibold font-mono">{l.code}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{l.user?.full_name || `Lector #${l.user_id}`}</div>
                                            <div className="text-xs text-muted-foreground">DNI: {l.user?.dni || "N/A"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {l.loan_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatDateTime(l.loan_date)}</TableCell>
                                        <TableCell className={isOverdue ? "text-destructive font-bold" : ""}>
                                            {formatDateTime(l.due_date)}
                                            {isOverdue && (
                                                <span className="block text-[10px] text-destructive">
                                                    (+{l.days_overdue} días atraso)
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    l.status === "Devuelto"
                                                        ? "secondary"
                                                        : isOverdue
                                                        ? "destructive"
                                                        : l.status === "Renovado"
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {isOverdue ? "Vencido" : l.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center justify-center bg-muted rounded-full px-2 py-0.5 text-xs font-semibold">
                                                {l.details?.length || 0}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modales vinculados */}
            <UiLoanView
                open={openView}
                onOpenChange={setOpenView}
                loan={selectedLoanDetail}
            />

            <UiLoanReturn
                open={openReturn}
                onOpenChange={setOpenReturn}
                loan={selectedLoanDetail}
                refreshLoans={refreshLoans}
                onOpenSurvey={(loanId) => {
                    setSurveyLoanId(loanId);
                    setOpenSurvey(true);
                }}
            />

            <UiLoanRenew
                open={openRenew}
                onOpenChange={setOpenRenew}
                loan={selectedLoanDetail}
                refreshLoans={refreshLoans}
            />

            <UiSatisfactionSubmit
                open={openSurvey}
                onOpenChange={setOpenSurvey}
                loanId={surveyLoanId}
            />
        </div>
    );
}
