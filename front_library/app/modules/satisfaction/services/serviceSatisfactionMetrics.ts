import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { SatisfactionMetrics } from "../type/typeSatisfactionBase";

export async function serviceSatisfactionMetrics(
  faculty_id?: number
): Promise<SatisfactionMetrics> {
  const query = new URLSearchParams();
  if (faculty_id !== undefined) query.set("faculty_id", String(faculty_id));

  const res = await fetch(
    `${apiBackend}/v1/satisfaction/metrics?${query.toString()}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail ?? "Error al obtener métricas");
  }

  return res.json();
}
