import { apiBackend } from "@/config/constants";
import { handleApiResponse } from "@/lib/utils";
import { Login } from "./typeLogin";

export const serviceLogin = async (data: Login) => {
  const response = await fetch(`${apiBackend}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleApiResponse<{ access_token: string; token_type: string }>(
    response,
    "Error al iniciar sesión"
  );
};
