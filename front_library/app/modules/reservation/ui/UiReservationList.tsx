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
                <Badge variant="destructive" className="gap-1 text-xs">
                    <FaTimesCircle className="size-3" /> Expirada
                </Badge>
            );
        }
        switch (r.status) {
            case "Pendiente":
                return (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-300 dark:text-amber-400 gap-1 text-xs">
                        <FaClock className="size-3" /> Pendiente
                    </Badge>
                );
            case "Lista_Para_Recojo":
                return (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-300 dark:text-blue-400 font-semibold gap-1 text-xs">
                        <FaBookmark className="size-3" /> Lista para Recojo
                    </Badge>
                );
            case "Completada":
                return (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400 gap-1 text-xs">
                        <FaCheckCircle className="size-3" /> Completada
                    </Badge>
                );
            case "Cancelada":
                return (
                    <Badge variant="secondary" className="gap-1 text-xs">
                        <FaBan className="size-3" /> Cancelada
                    </Badge>
                );
            default:
                return <Badge variant="outline">{r.status}</Badge>;
        }
    };

    if (loadingReservations && reservations.length === 0) return <LoadingText />;
    if (errorReservations) return <p className="text-destructive font-medium">{errorReservations}</p>;

    const canReady = selectedReservation?.status === "Pendiente";
    const canFulfill = selectedReservation?.status === "Lista_Para_Recojo" || selectedReservation?.status === "Pendiente";
    const canCancel = selectedReservation?.status === "Pendiente" || (selectedReservation?.status === "Lista_Para_Recojo" && !selectedReservation?.is_expired);

    return (
        <div className="space-y-4">
            {/* Tarjetas de Métricas Resumen */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="rounded-xl border p-3 bg-card shadow-xs">
                    <div className="text-xs text-muted-foreground font-medium">Total Solicitudes</div>
                    <div className="text-2xl font-bold mt-1">{countTotal}</div>
                </div>
                <div className="rounded-xl border border-amber-300/40 dark:border-amber-700/40 p-3 bg-amber-500/5 shadow-xs">
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">En Cola de Espera</div>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{countPending}</div>
                </div>
                <div className="rounded-xl border border-blue-300/40 dark:border-blue-700/40 p-3 bg-blue-500/5 shadow-xs">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Listas para Recojo</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{countReady}</div>
                </div>
                <div className="rounded-xl border border-emerald-300/40 dark:border-emerald-700/40 p-3 bg-emerald-500/5 shadow-xs">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Entregadas / Completadas</div>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{countFulfilled}</div>
                </div>
                <div className="rounded-xl border border-rose-300/40 dark:border-rose-700/40 p-3 bg-rose-500/5 shadow-xs">
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">Canceladas / Expiradas</div>
                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{countCancelled}</div>
                </div>
            </div>

            {/* Barra de herramientas y acciones */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                <div className="flex flex-wrap gap-2 items-center">
                    <UiReservationCreate refreshReservations={refreshReservations} />

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
                        disabled={!selectedId || !canReady}
                        onClick={handleReady}
                        className="gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <FaBookmark className="size-4" /> Preparar para Recojo
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || !canFulfill}
                        onClick={handleFulfill}
                        className="gap-2 text-emerald-600 hover:text-emerald-700"
                    >
                        <FaCheckCircle className="size-4" /> Entregar / Formalizar
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedId || !canCancel}
                        onClick={handleCancel}
                        className="gap-2 text-destructive hover:text-destructive"
                    >
                        <FaBan className="size-4" /> Cancelar
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <FaSearch className="absolute left-2.5 top-2.5 text-muted-foreground size-4" />
                        <Input
                            placeholder="Buscar código, lector, título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 h-9 text-xs"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[170px] h-9 text-xs">
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
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={refreshReservations}
                        title="Recargar lista"
                    >
                        <FaSync className="size-3.5" />
                    </Button>
                </div>
            </div>

            {/* Tabla de Reservaciones */}
            <div className="rounded-md border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
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
                                        className={`cursor-pointer transition-colors ${
                                            isSelected ? "bg-primary/10 hover:bg-primary/15" : ""
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
                                                    <FaHourglassHalf className={r.hours_left_to_pickup <= 12 ? "text-destructive size-3" : "text-blue-500 size-3"} />
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
