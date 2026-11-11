"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, LoaderCircle, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/loading";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "./useLogin";

export default function LoginPage() {
    const { formLogin, login, loading } = useLogin();
    const isAuthenticated = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated === true) router.replace("/modules/");
    }, [isAuthenticated, router]);

    if (loading && isAuthenticated === true) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
                <LoadingSpinner />
                <p className="text-sm text-muted-foreground">Abriendo tu espacio de trabajo…</p>
            </div>
        );
    }

    return (
        <main className="grid min-h-svh bg-background md:grid-cols-[1.05fr_0.95fr]">
            <aside className="relative hidden overflow-hidden bg-brand-ink text-brand-paper md:flex">
                <Image
                    alt=""
                    className="absolute inset-0 object-cover object-center"
                    fill
                    priority
                    sizes="(max-width: 1024px) 0px, 55vw"
                    src="/library-reading-room.png"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-brand-ink/60 to-brand-ink/55" />
                <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
                    <Link href="/" aria-label="SIBI, página de inicio" className="flex w-fit items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-copper text-brand-paper">
                            <BookOpen aria-hidden="true" />
                        </span>
                        <span className="flex flex-col leading-tight">
                            <span className="font-semibold tracking-[0.15em]">SIBI</span>
                            <span className="text-xs text-brand-paper/70">Biblioteca universitaria</span>
                        </span>
                    </Link>

                    <div className="max-w-xl pb-8">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-paper/70">Universidad Nacional de San Martín</p>
                        <h1 className="mt-5 font-landing-display text-5xl leading-[1.02] tracking-tight xl:text-6xl">
                            El conocimiento merece un buen lugar.
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-brand-paper/75">
                            Un entorno de trabajo para cuidar la circulación, las reservas y la memoria académica de la universidad.
                        </p>
                    </div>

                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-paper/60">Sistema de bibliotecas · SIBI</p>
                </div>
            </aside>

            <section className="flex min-h-svh flex-col px-5 py-5 sm:px-8 lg:px-12">
                <header className="flex items-center justify-between">
                    <Button asChild size="icon" variant="ghost" aria-label="Volver al inicio">
                        <Link href="/">
                            <ArrowLeft aria-hidden="true" />
                        </Link>
                    </Button>
                    <ModeToggle />
                </header>

                <div className="mx-auto flex w-full max-w-lg flex-1 items-center py-10">
                    <section aria-labelledby="login-title" className="w-full overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-xl shadow-brand-ink/5">
                        <div className="border-b border-border/70 bg-muted/50 px-6 py-7 sm:px-9">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <ShieldCheck aria-hidden="true" />
                            </div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Portal institucional</p>
                            <h2 id="login-title" className="mt-2 font-landing-display text-4xl leading-tight tracking-tight">Bienvenido de nuevo</h2>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Ingresa con tus credenciales para continuar en SIBI.
                            </p>
                        </div>

                        <div className="px-6 py-7 sm:px-9">
                            <Form {...formLogin}>
                                <form onSubmit={formLogin.handleSubmit(login)} className="flex flex-col gap-5">
                                    <FormField
                                        control={formLogin.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Usuario</FormLabel>
                                                <FormControl>
                                                    <Input autoComplete="username" placeholder="Tu usuario institucional" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formLogin.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input autoComplete="current-password" placeholder="Ingresa tu contraseña" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="mt-2 w-full" disabled={loading} type="submit">
                                        {loading ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <ShieldCheck data-icon="inline-start" />}
                                        {loading ? "Verificando acceso…" : "Ingresar al sistema"}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        <div className="border-t border-border/70 px-6 py-5 sm:px-9">
                            <p className="text-sm leading-6 text-muted-foreground">
                                ¿Necesitas acceso? Solicítalo a la administración de la biblioteca.
                            </p>
                        </div>
                    </section>
                </div>

                <p className="text-center text-xs text-muted-foreground">SIBI · Universidad Nacional de San Martín</p>
            </section>
        </main>
    );
}
