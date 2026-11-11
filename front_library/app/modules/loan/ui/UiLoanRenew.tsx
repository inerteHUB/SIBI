"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { Loan } from "../type/typeLoanBase";
import { useLoanRenew } from "../hooks/useLoanRenew";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loan: Loan | null;
    refreshLoans: () => void;
}

export default function UiLoanRenew({ open, onOpenChange, loan, refreshLoans }: Props) {
    const [days, setDays] = useState<number>(3);
    const [observation, setObservation] = useState<string>("");
    const { processRenew, loading } = useLoanRenew(() => {
        refreshLoans();
        onOpenChange(false);
    });

    if (!loan) return null;

    const handleRenew = async () => {
        await processRenew(loan.id, {
            additional_days: days,
            observation: observation || undefined,
        });
    };

    const hasReachedLimit = loan.renewal_count >= loan.max_renewals;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="border-b pb-3">Renovar Préstamo: {loan.code}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2 text-sm">
                    <div className="grid grid-cols-2 gap-2 p-3 bg-muted/40 rounded-lg text-xs md:text-sm">
                        <p><span className="text-muted-foreground">Lector:</span> {loan.user?.full_name}</p>
                        <p><span className="text-muted-foreground">Vence:</span> {formatDateTime(loan.due_date)}</p>
                        <p className="col-span-2">
                            <span className="text-muted-foreground">Renovaciones usadas:</span>{" "}
                            <span className={hasReachedLimit ? "text-destructive font-bold" : "font-medium"}>
                                {loan.renewal_count} de {loan.max_renewals} permitidas
                            </span>
                        </p>
                    </div>

                    {hasReachedLimit ? (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-xs">
                            Este préstamo ya alcanzó el tope máximo de renovaciones ({loan.max_renewals}). Debe realizarse la devolución física del material.
                        </div>
                    ) : loan.is_overdue ? (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-xs">
                            Este préstamo ya se encuentra vencido. Las políticas de biblioteca exigen la devolución antes de permitir una nueva asignación.
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="renew-days">Días adicionales a prorrogar</Label>
                                <Select value={String(days)} onValueChange={(val) => setDays(Number(val))}>
                                    <SelectTrigger id="renew-days">
                                        <SelectValue placeholder="Seleccionar días" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">3 días adicionales</SelectItem>
                                        <SelectItem value="5">5 días adicionales</SelectItem>
                                        <SelectItem value="7">7 días adicionales (1 semana)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="renew-obs">Motivo u observación</Label>
                                <Input
                                    id="renew-obs"
                                    placeholder="Ej: Solicitud de extensión por periodo de exámenes"
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleRenew}
                        disabled={loading || hasReachedLimit || loan.is_overdue}
                    >
                        {loading ? "Procesando..." : "Confirmar Renovación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
