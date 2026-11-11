"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reservation } from "../type/typeReservationBase";
import { useReservationCancel } from "../hooks/useReservationCancel";
import { FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservation: Reservation | null;
    refreshReservations: () => void;
}

export default function UiReservationCancel({ open, onOpenChange, reservation, refreshReservations }: Props) {
    const [reason, setReason] = useState<string>("");

    const { processCancel, loading } = useReservationCancel(() => {
        refreshReservations();
        onOpenChange(false);
    });

    if (!reservation) return null;

    const handleConfirm = async () => {
        await processCancel(reservation.id, {
            reason: reason || undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 border-b pb-3 text-destructive">
                        <FaTimesCircle />
                        <span>Cancelar Reserva: {reservation.code}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground pt-1">
                        Esta acción anulará la solicitud de reserva.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs space-y-2">
                        <div className="flex items-center gap-2 text-destructive font-semibold">
                            <FaExclamationTriangle className="size-4 shrink-0" />
                            <span>Reorganización automática de la cola</span>
                        </div>
                        <p className="text-muted-foreground">
                            Al cancelar esta reserva, los demás lectores en espera para este libro avanzarán automáticamente de posición.
                        </p>
                    </div>

                    <div className="p-3 bg-muted/40 rounded-lg text-xs md:text-sm space-y-1">
                        <p><span className="text-muted-foreground">Lector:</span> <span className="font-medium">{reservation.user?.full_name || `#${reservation.user_id}`}</span></p>
                        <p><span className="text-muted-foreground">Libro:</span> <span className="font-medium">{reservation.title || `#${reservation.book_id}`}</span></p>
                        <p><span className="text-muted-foreground">Turno actual:</span> <span className="font-medium">#{reservation.queue_position}</span></p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cancel_reason">Motivo de la cancelación (Opcional)</Label>
                        <Textarea
                            id="cancel_reason"
                            placeholder="Ej: Usuario desistió, no acudió en plazo, material dañado..."
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Atrás
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? "Cancelando..." : "Confirmar Cancelación"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
