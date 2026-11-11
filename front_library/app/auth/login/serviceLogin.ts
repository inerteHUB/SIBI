import { handleApiResponse } from "@/lib/utils";
import { Login } from "./typeLogin";

export const serviceLogin = async (data: Login) => {
  const response = await fetch("/api/session/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  return handleApiResponse<{ authenticated: true }>(response, "Error al iniciar sesión");
};
