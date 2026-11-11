"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingText } from "@/components/loading";
import { formatDateTime } from "@/lib/utils";
import { 
    FaEye, 
    FaBookmark, 
    FaCheckCircle, 
    FaBan, 
    FaClock, 
    FaSync, 
    FaSearch,
    FaHourglassHalf,
    FaTimesCircle
} from "react-icons/fa";

import { Reservation } from "../type/typeReservationBase";
import { useReservationView } from "../hooks/useReservationView";

import UiReservationCreate from "./UiReservationCreate";
import UiReservationView   from "./UiReservationView";
import UiReservationReady  from "./UiReservationReady";
import UiReservationFulfill from "./UiReservationFulfill";
import UiReservationCancel from "./UiReservationCancel";

interface Props {
    reservations: Reservation[];
    loadingReservations: boolean;
    errorReservations: string | null;
    refreshReservations: () => void;
}

export default function UiReservationList({
    reservations,
    loadingReservations,
    errorReservations,
    refreshReservations,
}: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("TODOS");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [openView, setOpenView] = useState(false);
    const [openReady, setOpenReady] = useState(false);
    const [openFulfill, setOpenFulfill] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);

    const { reservation: selectedDetail, fetchReservation } = useReservationView();

    const selectedReservation = reservations.find((r) => r.id === selectedId) ?? null;

    const handleRowClick = (id: number) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };

    const handleView = async () => {
        if (!selectedId) return;
        await fetchReservation(selectedId);
        setOpenView(true);
    };

    const handleReady = async () => {
        if (!selectedId) return;
        await fetchReservation(selectedId);
        setOpenReady(true);
    };

    const handleFulfill = async () => {
        if (!selectedId) return;
        await fetchReservation(selectedId);
        setOpenFulfill(true);
    };

    const handleCancel = async () => {
        if (!selectedId) return;
        await fetchReservation(selectedId);
        setOpenCancel(true);
    };

    // Filtros locales
    const filteredReservations = reservations.filter((r) => {
        const matchesStatus =
            statusFilter === "TODOS" ||
            r.status === statusFilter ||
            (statusFilter === "Expirada" && (r.is_expired || r.status === "Expirada"));

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            searchTerm === "" ||
            r.code.toLowerCase().includes(searchLower) ||
            (r.title && r.title.toLowerCase().includes(searchLower)) ||
            (r.user?.full_name && r.user.full_name.toLowerCase().includes(searchLower)) ||
            (r.user?.dni && r.user.dni.includes(searchTerm));

        return matchesStatus && matchesSearch;
    });

    // Métricas rápidas
    const countTotal = reservations.length;
    const countPending = reservations.filter((r) => r.status === "Pendiente").length;
    const countReady = reservations.filter((r) => r.status === "Lista_Para_Recojo" && !r.is_expired).length;
    const countFulfilled = reservations.filter((r) => r.status === "Completada").length;
    const countCancelled = reservations.filter((r) => r.status === "Cancelada" || r.status === "Expirada" || r.is_expired).length;

    const renderStatusBadge = (r: Reservation) => {
        if (r.is_expired || r.status === "Expirada") {
            return (
                <Badge variant="destructive" className="gap-1">
                    <FaTimesCircle aria-hidden="true" data-icon="inline-start" /> Expirada
                </Badge>
            );
        }
        switch (r.status) {
            case "Pendiente":
                return (
                    <Badge variant="outline" className="gap-1 border-warning/60 bg-warning/20 text-warning-foreground">
                        <FaClock aria-hidden="true" data-icon="inline-start" /> Pendiente
                    </Badge>
                );
            case "Lista_Para_Recojo":
                return (
                    <Badge variant="default" className="gap-1 font-semibold">
                        <FaBookmark aria-hidden="true" data-icon="inline-start" /> Lista para recojo
                    </Badge>
                );
            case "Completada":
                return (
                    <Badge variant="secondary" className="gap-1">
                        <FaCheckCircle aria-hidden="true" data-icon="inline-start" /> Completada
                    </Badge>
                );
            case "Cancelada":
                return (
<Badge variant="outline" className="gap-1">
                    <FaBan aria-hidden="true" data-icon="inline-start" /> Cancelada
                    </Badge>
                );
            default:
                return <Badge variant="outline">{r.status}</Badge>;
        }
    };

    if (loadingReservations && reservations.length === 0) return <LoadingText />;
    if (errorReservations) return <p className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 font-medium text-destructive" role="alert">{errorReservations}</p>;

    const canReady = selectedReservation?.status === "Pendiente";
    const canFulfill = selectedReservation?.status === "Lista_Para_Recojo" || selectedReservation?.status === "Pendiente";
    const canCancel = selectedReservation?.status === "Pendiente" || (selectedReservation?.status === "Lista_Para_Recojo" && !selectedReservation?.is_expired);

    return (
        <div className="flex flex-col gap-5">
            <section aria-label="Resumen de reservas" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                {[
                    { label: "Solicitudes", value: countTotal, note: "Registros consultados", icon: FaBookmark },
                    { label: "En espera", value: countPending, note: "Pendientes de atención", icon: FaClock },
                    { label: "Listas para recojo", value: countReady, note: "Dentro de su ventana", icon: FaHourglassHalf },
                    { label: "Completadas", value: countFulfilled, note: "Entregas formalizadas", icon: FaCheckCircle },
                    { label: "Cerradas", value: countCancelled, note: "Canceladas o expiradas", icon: FaBan },
                ].map(({ label, value, note, icon: Icon }) => (
                    <article key={label} className="rounded-2xl border border-border/80 border-t-2 border-t-primary bg-card p-4 shadow-sm sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px]">{label}</p>
                                <p className="mt-2 font-landing-display text-3xl leading-none sm:text-4xl">{value}</p>
                            </div>
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                                <Icon aria-hidden="true" />
                            </span>
                        </div>
                        <p className="mt-4 text-[11px] leading-4 text-muted-foreground">{note}</p>
                    </article>
                ))}
            </section>

            {/* Barra de herramientas y acciones */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-5">
                <div className="flex flex-wrap gap-2 items-center">
                    <UiReservationCreate refreshReservations={refreshReservations} />

                    <p aria-live="polite" className="min-h-8 self-center text-xs text-muted-foreground">
                        {selectedReservation ? `Seleccionada: ${selectedReservation.code}` : "Selecciona una fila para ver las acciones disponibles."}
                    </p>

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
                        disabled={!selectedId || !canReady}
                        onClick={handleReady}
                        className="gap-2 text-primary"
                    >
                        <FaBookmark aria-hidden="true" data-icon="inline-start" /> Preparar para recojo
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || !canFulfill}
                        onClick={handleFulfill}
                        className="gap-2 text-secondary-foreground"
                    >
                        <FaCheckCircle aria-hidden="true" data-icon="inline-start" /> Registrar entrega
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || !canCancel}
                        onClick={handleCancel}
                        className="gap-2 text-destructive hover:text-destructive"
                    >
                        <FaBan aria-hidden="true" data-icon="inline-start" /> Cancelar reserva
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <div className="relative w-full sm:w-64">
                        <label className="sr-only" htmlFor="reservation-search">Buscar reservas</label>
                        <FaSearch aria-hidden="true" className="absolute left-2.5 top-3 text-muted-foreground" />
                        <Input
                            id="reservation-search"
                            aria-label="Buscar código, lector o título"
                            placeholder="Buscar código, lector, título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 h-9 text-xs"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger aria-label="Filtrar reservas por estado" className="h-10 w-[190px] text-sm">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODOS">Todos los estados</SelectItem>
                            <SelectItem value="Pendiente">En Cola (Pendiente)</SelectItem>
                            <SelectItem value="Lista_Para_Recojo">Listas para Recojo</SelectItem>
                            <SelectItem value="Completada">Completadas</SelectItem>
                            <SelectItem value="Expirada">Expiradas</SelectItem>
                            <SelectItem value="Cancelada">Canceladas</SelectItem>
                        </SelectContent>
                    </Select>

                        <Button
                        aria-label="Actualizar reservas"
                        variant="ghost"
                        size="icon"
                        onClick={refreshReservations}
                        title="Actualizar reservas"
                    >
                        <FaSync aria-hidden="true" data-icon="inline-start" />
                    </Button>
                </div>
            </div>

            {/* Tabla de Reservaciones */}
            <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                            <TableHead className="w-[160px]">Código</TableHead>
                            <TableHead>Lector</TableHead>
                            <TableHead>Título de la Obra</TableHead>
                            <TableHead className="text-center w-[100px]">Turno</TableHead>
                            <TableHead className="w-[160px]">Estado</TableHead>
                            <TableHead className="w-[180px]">Ventana / Plazo</TableHead>
                            <TableHead className="w-[150px]">Fecha Registro</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReservations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                                    No se encontraron reservaciones que coincidan con la búsqueda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReservations.map((r) => {
                                const isSelected = selectedId === r.id;
                                return (
                                    <TableRow
                                        key={r.id}
                                        onClick={() => handleRowClick(r.id)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                handleRowClick(r.id);
                                            }
                                        }}
                                        aria-selected={isSelected}
                                        tabIndex={0}
                                        className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                                            isSelected ? "bg-accent/70 hover:bg-accent" : "hover:bg-muted/70"
                                        }`}
                                    >
                                        <TableCell className="font-mono font-semibold text-xs">
                                            {r.code}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-xs">
                                                    {r.user?.full_name || `Lector #${r.user_id}`}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    DNI: {r.user?.dni || "N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-xs max-w-xs truncate" title={r.title || `Libro #${r.book_id}`}>
                                                    {r.title || `Libro #${r.book_id}`}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    ID Libro: #{r.book_id} {r.copy_id ? `| Ejemplar #${r.copy_id}` : ""}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {r.queue_position > 0 ? (
                                                <Badge
                                                    variant={r.queue_position === 1 ? "default" : "secondary"}
                                                    className="font-mono text-xs px-2"
                                                >
                                                    #{r.queue_position}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {renderStatusBadge(r)}
                                        </TableCell>
                                        <TableCell>
                                            {r.status === "Lista_Para_Recojo" && r.hours_left_to_pickup !== undefined && r.hours_left_to_pickup !== null ? (
                                                <div className="flex items-center gap-1.5 text-xs">
                                                    <FaHourglassHalf aria-hidden="true" className={r.hours_left_to_pickup <= 12 ? "text-destructive" : "text-primary"} />
                                                    <span className={r.hours_left_to_pickup <= 12 ? "text-destructive font-semibold" : "font-medium"}>
                                                        {r.hours_left_to_pickup > 0 ? `${r.hours_left_to_pickup} hrs restantes` : "Expirando"}
                                                    </span>
                                                </div>
                                            ) : r.expiration_date ? (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDateTime(r.expiration_date)}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {formatDateTime(r.reservation_date)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de Detalle */}
            <UiReservationView
                open={openView}
                onOpenChange={setOpenView}
                reservation={selectedDetail || selectedReservation}
            />

            {/* Modal de Preparación para Recojo */}
            <UiReservationReady
                open={openReady}
                onOpenChange={setOpenReady}
                reservation={selectedDetail || selectedReservation}
                refreshReservations={refreshReservations}
            />

            {/* Modal de Entrega / Formalización */}
            <UiReservationFulfill
                open={openFulfill}
                onOpenChange={setOpenFulfill}
                reservation={selectedDetail || selectedReservation}
                refreshReservations={refreshReservations}
            />

            {/* Modal de Cancelación */}
            <UiReservationCancel
                open={openCancel}
                onOpenChange={setOpenCancel}
                reservation={selectedDetail || selectedReservation}
                refreshReservations={refreshReservations}
            />
        </div>
    );
}
