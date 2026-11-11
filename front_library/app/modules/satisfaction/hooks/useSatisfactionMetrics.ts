"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SatisfactionMetrics } from "../type/typeSatisfactionBase";
import { serviceSatisfactionMetrics } from "../services/serviceSatisfactionMetrics";

export function useSatisfactionMetrics(facultyId?: number) {
  const [metrics, setMetrics] = useState<SatisfactionMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchMetrics(fId?: number) {
    setLoading(true);
    try {
      const data = await serviceSatisfactionMetrics(fId ?? facultyId);
      setMetrics(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cargar métricas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { metrics, loading, fetchMetrics };
}
