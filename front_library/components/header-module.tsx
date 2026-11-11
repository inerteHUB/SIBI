import { BookOpen } from "lucide-react";

export default function HeaderModule({ title, description }: { title: string; description: string }) {
    return (
        <header className="flex flex-col gap-4 border-b border-brand-line pb-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                    <BookOpen aria-hidden="true" /> SIBI · Gestión bibliotecaria
                </p>
                <h2 className="mt-3 font-landing-display text-4xl leading-tight tracking-tight sm:text-5xl">
                    {title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {description}
                </p>
            </div>
        </header>
    );
}
