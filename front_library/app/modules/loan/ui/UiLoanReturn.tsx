"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loan, LoanReturnDetailItem } from "../type/typeLoanBase";
import { useLoanReturn } from "../hooks/useLoanReturn";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loan: Loan | null;
    refreshLoans: () => void;
    onOpenSurvey?: (loanId: number) => void;
}

export default function UiLoanReturn({ open, onOpenChange, loan, refreshLoans, onOpenSurvey }: Props) {
    const [conditions, setConditions] = useState<Record<number, string>>({});
    const [notes, setNotes] = useState<Record<number, string>>({});
    const [observation, setObservation] = useState<string>("");

    const { processReturn, loading, lastResult, setLastResult } = useLoanReturn(() => {
        refreshLoans();
    });

    if (!loan) return null;

    const handleConditionChange = (detailId: number, value: string) => {
        setConditions((prev) => ({ ...prev, [detailId]: value }));
    };

    const handleNotesChange = (detailId: number, value: string) => {
        setNotes((prev) => ({ ...prev, [detailId]: value }));
    };

    const handleConfirmReturn = async () => {
        const detailsPayload: LoanReturnDetailItem[] = loan.details.map((d) => ({
            detail_id: d.id,
            final_condition: conditions[d.id] || d.initial_condition || "Bueno",
            notes: notes[d.id] || undefined,
        }));

        const result = await processReturn(loan.id, {
            details: detailsPayload,
            observation: observation || undefined,
        });

        if (result && !result.survey_eligible) {
            onOpenChange(false);
        }
    };

    const handleClose = () => {
        setLastResult(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="border-b pb-3">Registrar Devolución: {loan.code}</DialogTitle>
                </DialogHeader>

                {lastResult ? (
                    // Pantalla de confirmación y puente hacia la Encuesta de Satisfacción
                    <div className="py-6 text-center space-y-4">
                        <div className="text-4xl">📚✅</div>
                        <h3 className="text-lg font-bold text-primary">¡Devolución Procesada con Éxito!</h3>
                        <p className="text-sm text-muted-foreground">{lastResult.message}</p>

                        {lastResult.survey_eligible && (
                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 mt-4 space-y-3">
                                <h4 className="font-semibold text-sm">⭐ Medición de Calidad del Servicio</h4>
                                <p className="text-xs text-muted-foreground">{lastResult.survey_prompt}</p>
                                <Button
                                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium gap-2"
                                    onClick={() => {
                                        handleClose();
                                        if (onOpenSurvey) {
                                            onOpenSurvey(loan.id);
                                        }
                                    }}
                                >
                                    Calificar Servicio Ahora
                                </Button>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button variant="secondary" onClick={handleClose}>
                                Cerrar Ventana
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Formulario de inspección de devolución
                    <div className="space-y-4 py-2 text-sm">
                        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/40 rounded-lg text-xs md:text-sm">
                            <p><span className="text-muted-foreground">Lector:</span> {loan.user?.full_name}</p>
                            <p><span className="text-muted-foreground">Tipo:</span> {loan.loan_type}</p>
                        </div>

                        <div>
                            <Label className="font-semibold text-primary mb-2 block">
                                Estado Físico de Ejemplares al Devolver
                            </Label>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 text-xs">
                                            <TableHead>Título</TableHead>
                                            <TableHead>Cond. Inicial</TableHead>
                                            <TableHead className="w-40">Cond. Final</TableHead>
                                            <TableHead>Notas</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loan.details.map((detail) => (
                                            <TableRow key={detail.id} className="text-xs">
                                                <TableCell className="font-medium">{detail.title || `#${detail.copy_id}`}</TableCell>
                                                <TableCell>{detail.initial_condition}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        defaultValue={detail.initial_condition || "Bueno"}
                                                        onValueChange={(val) => handleConditionChange(detail.id, val)}
                                                    >
                                                        <SelectTrigger className="h-8 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Bueno">Bueno (Sin daños)</SelectItem>
                                                            <SelectItem value="Regular">Regular (Uso normal)</SelectItem>
                                                            <SelectItem value="Dañado">Dañado (Páginas rotas/rayado)</SelectItem>
                                                            <SelectItem value="Extraviado">Extraviado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        className="h-8 text-xs"
                                                        placeholder="Detalle de daños..."
                                                        onChange={(e) => handleNotesChange(detail.id, e.target.value)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ret-obs">Observaciones generales de recepción</Label>
                            <Input
                                id="ret-obs"
                                placeholder="Ej: Material recibido conforme en ventanilla..."
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-3">
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirmReturn} disabled={loading}>
                                {loading ? "Procesando..." : "Confirmar Devolución"}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
