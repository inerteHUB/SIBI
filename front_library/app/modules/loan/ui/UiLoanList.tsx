"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingText } from "@/components/loading";
import { formatDateTime } from "@/lib/utils";
import { FaEye, FaUndo, FaCalendarPlus } from "react-icons/fa";

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

    if (loadingLoans && loans.length === 0) return <LoadingText />;
    if (errorLoans) return <p className="text-destructive font-medium">{errorLoans}</p>;

    return (
        <div className="space-y-4">
            {/* Barra de herramientas y filtros */}
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
                        <FaEye className="size-4" /> Ver Detalle
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || selectedLoan?.status === "Devuelto"}
                        onClick={handleReturn}
                        className="gap-2 text-emerald-600 dark:text-emerald-400"
                    >
                        <FaUndo className="size-4" /> Devolución
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || selectedLoan?.status === "Devuelto" || selectedLoan?.is_overdue}
                        onClick={handleRenew}
                        className="gap-2 text-blue-600 dark:text-blue-400"
                    >
                        <FaCalendarPlus className="size-4" /> Renovar
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                    <Input
                        placeholder="Buscar por código, lector o DNI..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 h-9 text-xs"
                    />

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-36 h-9 text-xs">
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

            {/* Tabla de préstamos */}
            <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 text-xs">
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
                                        className={`cursor-pointer transition-colors text-xs md:text-sm ${
                                            isSelected ? "bg-muted" : "hover:bg-muted/40"
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
