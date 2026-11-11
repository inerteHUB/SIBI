"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reservation } from "../type/typeReservationBase";
import { useReservationFulfill } from "../hooks/useReservationFulfill";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservation: Reservation | null;
    refreshReservations: () => void;
}

export default function UiReservationFulfill({ open, onOpenChange, reservation, refreshReservations }: Props) {
    const [loanId, setLoanId] = useState<number | string>("");
    const [observation, setObservation] = useState<string>("");

    const { processFulfill, loading } = useReservationFulfill(() => {
        refreshReservations();
        onOpenChange(false);
    });

    if (!reservation) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loanId || Number(loanId) <= 0) return;

        await processFulfill(reservation.id, {
            loan_id: Number(loanId),
            observation: observation || undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 border-b pb-3 text-emerald-600 dark:text-emerald-400">
                        <FaCheckCircle />
                        <span>Formalizar Entrega: {reservation.code}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground pt-1">
                        Vincula el préstamo generado al retirar el material en ventanilla y finaliza la reserva.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="p-3 bg-muted/40 rounded-lg text-xs md:text-sm space-y-1">
                        <p><span className="text-muted-foreground">Lector:</span> <span className="font-medium">{reservation.user?.full_name || `#${reservation.user_id}`}</span></p>
                        <p><span className="text-muted-foreground">Libro:</span> <span className="font-medium">{reservation.title || `#${reservation.book_id}`}</span></p>
                        {reservation.copy_id && (
                            <p><span className="text-muted-foreground">Ejemplar reservado:</span> <span className="font-medium">#{reservation.copy_id}</span></p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="loan_id">ID del Préstamo Generado <span className="text-destructive">*</span></Label>
                        <Input
                            id="loan_id"
                            type="number"
                            min={1}
                            placeholder="Ej: 42"
                            value={loanId}
                            onChange={(e) => setLoanId(e.target.value)}
                            required
                        />
                        <p className="text-[11px] text-muted-foreground">
                            Código identificador del préstamo registrado en el módulo de préstamos.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fulfill_observation">Notas de Entrega (Opcional)</Label>
                        <Textarea
                            id="fulfill_observation"
                            placeholder="Ej: Carnet universitario verificado, entregado conforme..."
                            rows={2}
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !loanId}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {loading ? "Completando..." : "Finalizar y Entregar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
