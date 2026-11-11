"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PendingLoanSurvey } from "../type/typeSatisfactionBase";
import { serviceSatisfactionPending } from "../services/serviceSatisfactionPending";

export function useSatisfactionPending() {
  const [pending, setPending] = useState<PendingLoanSurvey[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPending() {
    setLoading(true);
    try {
      const data = await serviceSatisfactionPending();
      setPending(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cargar pendientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  return { pending, loading, fetchPending };
}
