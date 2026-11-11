"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Reservation } from "../type/typeReservationBase";
import { FaClock, FaCheckCircle, FaTimesCircle, FaBookmark, FaUser, FaBook, FaHourglassHalf } from "react-icons/fa";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservation: Reservation | null;
}

export default function UiReservationView({ open, onOpenChange, reservation }: Props) {
    if (!reservation) return null;

    const getStatusBadge = (status: string, isExpired: boolean) => {
        if (isExpired || status === "Expirada") {
            return <Badge variant="destructive" className="gap-1"><FaTimesCircle className="size-3" /> Expirada</Badge>;
        }
        switch (status) {
            case "Pendiente":
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 dark:text-amber-400 gap-1"><FaClock className="size-3" /> Pendiente</Badge>;
            case "Lista_Para_Recojo":
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300 dark:text-blue-400 font-semibold gap-1"><FaBookmark className="size-3" /> Lista para Recojo</Badge>;
            case "Completada":
                return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400 gap-1"><FaCheckCircle className="size-3" /> Completada</Badge>;
            case "Cancelada":
                return <Badge variant="secondary" className="gap-1"><FaTimesCircle className="size-3" /> Cancelada</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">Reserva: {reservation.code}</span>
                            <Badge variant="secondary" className="font-mono">Turno #{reservation.queue_position}</Badge>
                        </div>
                        <div>
                            {getStatusBadge(reservation.status, reservation.is_expired)}
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2 text-sm">
                    {/* Alerta de tiempo restante para recojo */}
                    {reservation.status === "Lista_Para_Recojo" && reservation.hours_left_to_pickup !== undefined && reservation.hours_left_to_pickup !== null && (
                        <div className={`p-3 rounded-lg border flex items-center justify-between text-xs md:text-sm ${
                            reservation.hours_left_to_pickup <= 12 
                                ? "bg-destructive/10 border-destructive/30 text-destructive font-semibold" 
                                : "bg-blue-500/10 border-blue-300/40 text-blue-700 dark:text-blue-300"
                        }`}>
                            <div className="flex items-center gap-2">
                                <FaHourglassHalf className="size-4 animate-pulse" />
                                <span>Ventana de recojo activa</span>
                            </div>
                            <span className="font-bold">
                                {reservation.hours_left_to_pickup > 0 ? `${reservation.hours_left_to_pickup} hrs restantes` : "Tiempo agotado"}
                            </span>
                        </div>
                    )}

                    {/* Datos del Lector */}
                    <div className="rounded-lg border p-3 bg-muted/30">
                        <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                            <FaUser className="size-4" />
                            <h4>Datos del Lector</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                            <p><span className="text-muted-foreground">Nombre:</span> {reservation.user?.full_name || `Lector #${reservation.user_id}`}</p>
                            <p><span className="text-muted-foreground">DNI:</span> {reservation.user?.dni || "N/A"}</p>
                            <p><span className="text-muted-foreground">Usuario:</span> {reservation.user?.username || "N/A"}</p>
                            <p><span className="text-muted-foreground">Email:</span> {reservation.user?.email || "N/A"}</p>
                        </div>
                    </div>

                    {/* Datos del Libro y Ejemplar */}
                    <div className="rounded-lg border p-3 bg-muted/30">
                        <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                            <FaBook className="size-4" />
                            <h4>Material Solicitado</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                            <p className="col-span-2">
                                <span className="text-muted-foreground">Título / Obra:</span>{" "}
                                <span className="font-medium">{reservation.title || `Libro #${reservation.book_id}`}</span>
                            </p>
                            <p><span className="text-muted-foreground">ID Libro:</span> #{reservation.book_id}</p>
                            <p>
                                <span className="text-muted-foreground">Ejemplar Asignado:</span>{" "}
                                {reservation.copy_id ? <Badge variant="outline">Copia #{reservation.copy_id}</Badge> : "Pendiente de asignar"}
                            </p>
                            {reservation.loan && (
                                <p className="col-span-2">
                                    <span className="text-muted-foreground">Préstamo Formalizado:</span>{" "}
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Código {reservation.loan.code} ({reservation.loan.status})</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Línea de Fechas */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="border rounded-md p-2.5 text-center">
                            <span className="text-xs text-muted-foreground block">Fecha de Solicitud</span>
                            <span className="font-medium text-xs md:text-sm">{formatDateTime(reservation.reservation_date)}</span>
                        </div>
                        <div className="border rounded-md p-2.5 text-center">
                            <span className="text-xs text-muted-foreground block">Límite para Retiro</span>
                            <span className={`font-medium text-xs md:text-sm ${reservation.is_expired ? "text-destructive font-bold" : ""}`}>
                                {reservation.expiration_date ? formatDateTime(reservation.expiration_date) : "Aún no fijada"}
                            </span>
                        </div>
                    </div>

                    {/* Observaciones y Bitácora */}
                    {reservation.observation && (
                        <div className="border rounded-lg p-3 bg-muted/20">
                            <span className="text-xs font-semibold text-muted-foreground block mb-1">Observaciones / Trazabilidad</span>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{reservation.observation}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t pt-3">
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
