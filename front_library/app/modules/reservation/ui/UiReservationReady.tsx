"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Reservation } from "../type/typeReservationBase";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservation: Reservation | null;
    refreshReservations: () => void;
}

export default function UiReservationReady({ open, onOpenChange, reservation }: Props) {
    if (!reservation) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Preparar para retiro: {reservation.code}</DialogTitle>
                    <DialogDescription>
                        La reserva puede pasar a retiro cuando se pueda seleccionar un ejemplar real y aplicar el plazo configurado por el backend.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-2">
                    <div className="rounded-lg bg-muted/40 p-3 text-sm">
                        <p><span className="text-muted-foreground">Lector:</span> <span className="font-medium">{reservation.user?.full_name || `#${reservation.user_id}`}</span></p>
                        <p><span className="text-muted-foreground">Libro:</span> <span className="font-medium">{reservation.title || `#${reservation.book_id}`}</span></p>
                        <p><span className="text-muted-foreground">Turno:</span> <span className="font-semibold">Posición #{reservation.queue_position}</span></p>
                    </div>
                    <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200" role="status">
                        <p className="font-semibold">Acción bloqueada por contrato pendiente</p>
                        <p className="mt-1 text-xs leading-relaxed">
                            No hay un endpoint público de catálogo para verificar disponibilidad ni una política documentada de plazo de retiro. No se enviará un ID o plazo arbitrario.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
