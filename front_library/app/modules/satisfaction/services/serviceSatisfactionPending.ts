import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { PendingLoanSurvey } from "../type/typeSatisfactionBase";

export async function serviceSatisfactionPending(): Promise<PendingLoanSurvey[]> {
  const res = await fetch(`${apiBackend}/v1/satisfaction/pending`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail ?? "Error al obtener préstamos pendientes");
  }

  return res.json();
}
