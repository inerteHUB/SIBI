import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, Search } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const services = [
    {
        icon: Search,
        title: "Repositorio académico",
        description: "Consulta pública de tesis y trabajos de investigación de la comunidad universitaria.",
        href: "/landing/search",
        action: "Explorar repositorio",
    },
    {
        icon: BookOpen,
        title: "Préstamos y circulación",
        description: "Una vista de trabajo para acompañar la consulta, renovación y devolución de materiales.",
        href: "/auth/login",
        action: "Acceso institucional",
    },
    {
        icon: Bookmark,
        title: "Reservas y turnos",
        description: "Seguimiento de solicitudes, posiciones en cola y ventanas de recojo desde SIBI.",
        href: "/auth/login",
        action: "Acceso institucional",
    },
];

export default function HomePage() {
    return (
        <main className="min-h-svh bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" aria-label="SIBI, inicio" className="flex shrink-0 items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                            <BookOpen aria-hidden="true" />
                        </span>
                        <span className="flex flex-col leading-tight">
                            <span className="font-semibold tracking-[0.14em]">SIBI</span>
                            <span className="text-xs text-muted-foreground">Biblioteca universitaria</span>
                        </span>
                    </Link>

                    <nav aria-label="Navegación principal" className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
                        <Link className="transition-colors hover:text-foreground" href="#servicios">Servicios</Link>
                        <Link className="transition-colors hover:text-foreground" href="/landing/search">Repositorio</Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
                            <Link href="/landing/search">
                                <Search data-icon="inline-start" />
                                Repositorio
                            </Link>
                        </Button>
<Button asChild size="sm" className="hidden md:inline-flex">
                      <Link href="/auth/login">
                                Acceso institucional
                                <ArrowUpRight data-icon="inline-end" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 lg:px-8">
                <section aria-labelledby="hero-title" className="relative isolate overflow-hidden rounded-[2rem] bg-brand-ink text-brand-paper shadow-2xl shadow-brand-ink/15">
                    <Image
                        alt=""
                        className="absolute inset-0 -z-20 object-cover object-center"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 1280px"
                        src="/library-reading-room.png"
                    />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-ink via-brand-ink/90 to-brand-ink/35" />
                    <div className="grid min-h-[34rem] md:grid-cols-[1.15fr_0.85fr]">
                        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-16">
                            <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-paper/75">
                                <span aria-hidden="true" className="h-px w-8 bg-brand-copper" />
                                Universidad Nacional de San Martín
                            </p>
                            <h1 id="hero-title" className="max-w-2xl font-landing-display text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                                La biblioteca es el punto de partida.
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-7 text-brand-paper/80 sm:text-lg">
                                Un espacio digital para descubrir investigación y acompañar la vida bibliotecaria universitaria.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="lg">
                                    <Link href="/landing/search">
                                        Explorar el repositorio
                                        <ArrowRight data-icon="inline-end" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="secondary">
                                    <Link href="/auth/login">Ingresar a SIBI</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-end justify-start p-6 sm:p-10 md:justify-end lg:p-12">
                            <div className="max-w-xs rounded-2xl border border-brand-paper/20 bg-brand-ink/65 p-5 shadow-xl backdrop-blur-md">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-copper text-brand-paper">
                                    <BookOpen aria-hidden="true" />
                                </div>
                                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-paper/65">Conocimiento compartido</p>
                                <p className="mt-2 font-landing-display text-2xl leading-tight">Consulta, circulación y memoria académica.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="servicios" aria-labelledby="services-title" className="py-14 sm:py-20">
                    <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Un sistema, varios recorridos</p>
                            <h2 id="services-title" className="mt-3 font-landing-display text-4xl leading-tight tracking-tight sm:text-5xl">
                                El conocimiento, mejor conectado.
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-muted-foreground">
                            Accesos claros para quienes investigan y para quienes mantienen viva la biblioteca.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {services.map(({ icon: Icon, title, description, href, action }) => (
                            <Link key={title} href={href} className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                <article className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                                    <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    <h3 className="mt-6 font-landing-display text-2xl">{title}</h3>
                                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
                                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                        {action}
                                        <ArrowUpRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="border-t border-border/70 bg-card">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <span className="font-semibold tracking-[0.12em] text-foreground">SIBI · UNSM</span>
                    <span>Sistema de bibliotecas universitarias</span>
                </div>
            </footer>
        </main>
    );
}
