import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
});

// El navegador envía la cookie same-origin automáticamente; nunca se fija Content-Type
// para FormData porque el navegador debe generar su propio boundary.
export const getAuthHeadersMultipart = (): Record<string, string> => ({});

/**
 * Parsea mensajes de error devueltos por FastAPI (incluyendo arreglos de validación 422)
 */
export function parseApiError(errorData: unknown, fallback = "Error en la operación"): string {
  if (!errorData) return fallback;

  if (typeof errorData === "string") return errorData;

  if (typeof errorData === "object" && errorData !== null) {
    const errorObj = errorData as Record<string, unknown>;
    const detail = errorObj.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      // Formato típico de 422 en FastAPI: [{ loc: ['body', 'field'], msg: '...', type: '...' }]
      return detail
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            const loc = Array.isArray(item.loc) ? item.loc.slice(-1)[0] : "Campo";
            return `${loc}: ${item.msg || "Valor inválido"}`;
          }
          return String(item);
        })
        .join("; ");
    }

    if (typeof errorObj.message === "string") {
      return errorObj.message;
    }
  }

  return fallback;
}

/**
 * Maneja respuestas HTTP estándar de FastAPI:
 * - Respuestas 204 No Content retornan null sin llamar a response.json()
 * - Manejo de errores 401, 403, 404, 409, 422 con formateo legible
 */
export async function handleApiResponse<T = unknown>(response: Response, defaultErrorMsg = "Error en la solicitud"): Promise<T> {
  if (response.status === 204) {
    return null as T;
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
    }

    let errorData: unknown = null;
    try {
      errorData = await response.json();
    } catch {
      try {
        errorData = await response.text();
      } catch {
        errorData = null;
      }
    }

    const message = parseApiError(errorData, `${defaultErrorMsg} (Código ${response.status})`);
    throw new Error(message);
  }

  return response.json();
}

// formatea la fecha en formato (DD/MM/YYYY HH:MM)
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  const dateFormatted = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const timeFormatted = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${dateFormatted} ${timeFormatted}`;
}

// formatear fecha
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// formatear hora
export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
