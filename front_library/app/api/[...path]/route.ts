import { cookies } from "next/headers";

const SESSION_COOKIE = "sibi_session";
const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

function backendBaseUrl() {
  const configuredUrl = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  return configuredUrl?.replace(/\/+$/, "");
}

async function proxy(request: Request, path: string[]) {
  const backendBase = backendBaseUrl();
  if (!backendBase) {
    return Response.json({ detail: "El backend no está configurado. Configure BACKEND_API_URL en el entorno del servidor." }, { status: 503 });
  }

  if (!METHODS_WITHOUT_BODY.has(request.method) && !sameOrigin(request)) {
    return Response.json({ detail: "Solicitud de origen no válido." }, { status: 403 });
  }

  let target: URL;
  try {
    target = new URL(`${backendBase}/${path.map((part) => encodeURIComponent(part)).join("/")}`);
  } catch {
    return Response.json({ detail: "La URL del backend no es válida." }, { status: 500 });
  }
  target.search = new URL(request.url).search;

  const headers = new Headers();
  for (const name of ["accept", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (session) headers.set("authorization", `Bearer ${session}`);

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    cache: "no-store",
    redirect: "manual",
  };
  if (!METHODS_WITHOUT_BODY.has(request.method) && request.body) {
    init.body = request.body;
    init.duplex = "half";
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return Response.json({ detail: "No se pudo conectar con el servicio. Intente nuevamente." }, { status: 502 });
  }

  const responseHeaders = new Headers();
  for (const name of ["content-type", "content-disposition", "cache-control"]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  if (upstream.status === 401) {
    responseHeaders.append("set-cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function HEAD(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function PUT(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}

export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await context.params).path);
}
