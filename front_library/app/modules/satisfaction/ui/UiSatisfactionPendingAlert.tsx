"use client";
import { useState } from "react";
import { useSatisfactionPending } from "../hooks/useSatisfactionPending";
import { UiSatisfactionSubmit } from "./UiSatisfactionSubmit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Bell } from "lucide-react";

export function UiSatisfactionPendingAlert() {
  const { pending, loading, fetchPending } = useSatisfactionPending();
  const [open, setOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

  if (loading || pending.length === 0) return null;

  function openSurvey(loanId: number) {
    setSelectedLoanId(loanId);
    setOpen(true);
  }

  return (
    <>
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Bell className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              Tienes {pending.length} préstamo{pending.length > 1 ? "s" : ""} pendiente{pending.length > 1 ? "s" : ""} de calificar
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Tu opinión nos ayuda a mejorar el servicio
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {pending.map((loan) => (
            <Button
              key={loan.id}
              size="sm"
              variant="outline"
              className="h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 gap-1"
              onClick={() => openSurvey(loan.id)}
            >
              <Star className="w-3 h-3" />
              {loan.code}
              <Badge variant="secondary" className="text-[10px] ml-1">
                {loan.loan_type}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <UiSatisfactionSubmit
        open={open}
        onOpenChange={setOpen}
        loanId={selectedLoanId}
        onSuccess={fetchPending}
      />
    </>
  );
}
