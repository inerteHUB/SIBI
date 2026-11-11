"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { SatisfactionFeedback, SatisfactionListParams } from "../type/typeSatisfactionBase";
import { serviceSatisfactionList } from "../services/serviceSatisfactionList";

export function useSatisfactionList() {
  const [items, setItems] = useState<SatisfactionFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<SatisfactionListParams>({ limit: 50, skip: 0 });

  const fetch = useCallback(async (overrideParams?: SatisfactionListParams) => {
    setLoading(true);
    try {
      const merged = { ...params, ...overrideParams };
      setParams(merged);
      const data = await serviceSatisfactionList(merged);
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cargar encuestas");
    } finally {
      setLoading(false);
    }
  }, [params]);

  return { items, loading, params, fetch, setParams };
}
