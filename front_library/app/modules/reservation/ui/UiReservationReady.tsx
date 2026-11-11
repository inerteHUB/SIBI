"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reservation } from "../type/typeReservationBase";
import { useReservationReady } from "../hooks/useReservationReady";
import { FaBookmark } from "react-icons/fa";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservation: Reservation | null;
    refreshReservations: () => void;
}

export default function UiReservationReady({ open, onOpenChange, reservation, refreshReservations }: Props) {
    const [copyId, setCopyId] = useState<number | string>("");
    const [pickupHours, setPickupHours] = useState<string>("24");
    const [observation, setObservation] = useState<string>("");

    const { processReady, loading } = useReservationReady(() => {
        refreshReservations();
        onOpenChange(false);
    });

    if (!reservation) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!copyId || Number(copyId) <= 0) return;

        await processReady(reservation.id, {
            copy_id: Number(copyId),
            pickup_hours: Number(pickupHours) || 24,
            observation: observation || undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 border-b pb-3">
                        <FaBookmark className="text-blue-500" />
                        <span>Preparar para Retiro: {reservation.code}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground pt-1">
                        Apartar un ejemplar físico para que el usuario pueda recogerlo en ventanilla.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="p-3 bg-muted/40 rounded-lg text-xs md:text-sm space-y-1">
                        <p><span className="text-muted-foreground">Lector:</span> <span className="font-medium">{reservation.user?.full_name || `#${reservation.user_id}`}</span></p>
                        <p><span className="text-muted-foreground">Libro:</span> <span className="font-medium">{reservation.title || `#${reservation.book_id}`}</span></p>
                        <p><span className="text-muted-foreground">Turno:</span> <span className="font-semibold">Posición #{reservation.queue_position}</span></p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="copy_id">ID del Ejemplar Físico a Asignar <span className="text-destructive">*</span></Label>
                        <Input
                            id="copy_id"
                            type="number"
                            min={1}
                            placeholder="Ej: 104"
                            value={copyId}
                            onChange={(e) => setCopyId(e.target.value)}
                            required
                        />
                        <p className="text-[11px] text-muted-foreground">Código o ID del ejemplar físico disponible en estantería.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pickup_hours">Plazo de Retiro (Horas)</Label>
                        <Select value={pickupHours} onValueChange={setPickupHours}>
                            <SelectTrigger id="pickup_hours">
                                <SelectValue placeholder="Seleccione plazo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="24">24 horas (1 día - Estándar preliminar)</SelectItem>
                                <SelectItem value="48">48 horas (2 días)</SelectItem>
                                <SelectItem value="72">72 horas (3 días)</SelectItem>
                                <SelectItem value="120">120 horas (5 días)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-muted-foreground">Si no lo recoge en este plazo, la reserva expirará automáticamente.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ready_observation">Observaciones (Opcional)</Label>
                        <Textarea
                            id="ready_observation"
                            placeholder="Ej: Ubicado en estante de reservas de recepción..."
                            rows={2}
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !copyId} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "Apartando..." : "Confirmar Disponibilidad"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
