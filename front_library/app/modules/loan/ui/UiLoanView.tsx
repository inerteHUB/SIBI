"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { Loan } from "../type/typeLoanBase";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loan: Loan | null;
}

export default function UiLoanView({ open, onOpenChange, loan }: Props) {
    if (!loan) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between border-b pb-3">
                        <span className="text-xl font-bold">Préstamo: {loan.code}</span>
                        <div className="flex gap-2">
                            <Badge variant={loan.status === "Devuelto" ? "secondary" : loan.status === "Vencido" || loan.is_overdue ? "destructive" : "default"}>
                                {loan.is_overdue && loan.status !== "Devuelto" ? "Vencido" : loan.status}
                            </Badge>
                            <Badge variant="outline">{loan.loan_type}</Badge>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2 text-sm">
                    {/* Datos del Lector */}
                    <div className="rounded-lg border p-3 bg-muted/30">
                        <h4 className="font-semibold text-primary mb-2">Datos del Lector</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                            <p><span className="text-muted-foreground">Nombre:</span> {loan.user?.full_name || `Usuario #${loan.user_id}`}</p>
                            <p><span className="text-muted-foreground">DNI:</span> {loan.user?.dni || "N/A"}</p>
                            <p><span className="text-muted-foreground">Email:</span> {loan.user?.email || "N/A"}</p>
                            <p><span className="text-muted-foreground">Renovaciones:</span> {loan.renewal_count} / {loan.max_renewals}</p>
                        </div>
                    </div>

                    {/* Fechas de Préstamo */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="border rounded-md p-2 text-center">
                            <span className="text-xs text-muted-foreground block">Fecha Préstamo</span>
                            <span className="font-medium text-xs md:text-sm">{formatDateTime(loan.loan_date)}</span>
                        </div>
                        <div className="border rounded-md p-2 text-center">
                            <span className="text-xs text-muted-foreground block">Fecha Límite</span>
                            <span className={`font-medium text-xs md:text-sm ${loan.is_overdue && loan.status !== "Devuelto" ? "text-destructive font-bold" : ""}`}>
                                {formatDateTime(loan.due_date)}
                            </span>
                        </div>
                        <div className="border rounded-md p-2 text-center">
                            <span className="text-xs text-muted-foreground block">Fecha Devolución</span>
                            <span className="font-medium text-xs md:text-sm">{loan.return_date ? formatDateTime(loan.return_date) : "Pendiente"}</span>
                        </div>
                    </div>

                    {loan.is_overdue && loan.status !== "Devuelto" && (
                        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2 text-destructive text-xs font-semibold text-center">
                            ⚠️ Este préstamo presenta {loan.days_overdue} día(s) de atraso respecto a su fecha límite.
                        </div>
                    )}

                    {/* Ejemplares asociados */}
                    <div>
                        <h4 className="font-semibold text-primary mb-2">Ejemplares Prestados ({loan.details?.length || 0})</h4>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 text-xs">
                                        <TableHead>Ejemplar</TableHead>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Cond. Inicial</TableHead>
                                        <TableHead>Cond. Final</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loan.details?.map((detail) => (
                                        <TableRow key={detail.id} className="text-xs">
                                            <TableCell className="font-mono">{detail.copy_code || `#${detail.copy_id}`}</TableCell>
                                            <TableCell className="font-medium">{detail.title || "Sin título"}</TableCell>
                                            <TableCell>{detail.initial_condition}</TableCell>
                                            <TableCell>{detail.final_condition || "-"}</TableCell>
                                            <TableCell>
                                                <Badge variant={detail.status === "Devuelto" ? "secondary" : "outline"}>
                                                    {detail.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {loan.observation && (
                        <div className="border-t pt-2 text-xs text-muted-foreground">
                            <span className="font-semibold">Observaciones:</span> {loan.observation}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
