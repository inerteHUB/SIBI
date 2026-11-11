const SESSION_COOKIE = "sibi_session";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ detail: "Solicitud de origen no válido." }, { status: 403 });
  }

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return Response.json(
    { authenticated: false },
    {
      headers: {
        "set-cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
        "cache-control": "no-store",
      },
    },
  );
}
