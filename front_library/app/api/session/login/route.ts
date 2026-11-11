const SESSION_COOKIE = "sibi_session";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ detail: "Solicitud de origen no válido." }, { status: 403 });
  }

  const backendBase = (process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL)?.replace(/\/+$/, "");
  if (!backendBase) {
    return Response.json({ detail: "El backend no está configurado. Configure BACKEND_API_URL en el entorno del servidor." }, { status: 503 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${backendBase}/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: await request.text(),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return Response.json({ detail: "No se pudo conectar con el servicio de autenticación." }, { status: 502 });
  }

  if (!upstream.ok) {
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  }

  let payload: unknown;
  try {
    payload = await upstream.json();
  } catch {
    return Response.json({ detail: "La respuesta de autenticación no es válida." }, { status: 502 });
  }

  if (!payload || typeof payload !== "object" || !("access_token" in payload) || typeof payload.access_token !== "string") {
    return Response.json({ detail: "La respuesta de autenticación no contiene un token válido." }, { status: 502 });
  }

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return Response.json(
    { authenticated: true },
    {
      headers: {
        "set-cookie": `${SESSION_COOKIE}=${encodeURIComponent(payload.access_token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${secure}`,
        "cache-control": "no-store",
      },
    },
  );
}
