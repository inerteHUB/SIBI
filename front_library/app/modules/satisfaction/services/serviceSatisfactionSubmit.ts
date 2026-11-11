import { apiBackend } from "@/config/constants";
import { getAuthHeaders } from "@/lib/utils";
import { SatisfactionCreate, SatisfactionFeedback } from "../type/typeSatisfactionBase";

export async function serviceSatisfactionSubmit(
  payload: SatisfactionCreate
): Promise<SatisfactionFeedback> {
  const res = await fetch(`${apiBackend}/v1/satisfaction/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail ?? "Error al enviar la encuesta");
  }

  return res.json();
}
