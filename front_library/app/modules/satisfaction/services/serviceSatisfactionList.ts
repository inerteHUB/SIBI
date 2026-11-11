import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { SatisfactionFeedback, SatisfactionListParams } from "../type/typeSatisfactionBase";

export async function serviceSatisfactionList(
  params: SatisfactionListParams = {}
): Promise<SatisfactionFeedback[]> {
  const query = new URLSearchParams();
  if (params.faculty_id !== undefined) query.set("faculty_id", String(params.faculty_id));
  if (params.service_type) query.set("service_type", params.service_type);
  if (params.min_rating !== undefined) query.set("min_rating", String(params.min_rating));
  if (params.skip !== undefined) query.set("skip", String(params.skip));
  if (params.limit !== undefined) query.set("limit", String(params.limit));

  const res = await fetch(`${apiBackend}/v1/satisfaction/?${query.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail ?? "Error al obtener encuestas");
  }

  return res.json();
}
