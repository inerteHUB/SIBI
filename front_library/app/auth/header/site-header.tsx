import { BookOpen } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderUser } from "../typeSystemData";
import UserMenu from "./user-menu";

export function SiteHeader({ user }: { user: HeaderUser }) {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center border-b border-border/70 bg-card/90 backdrop-blur-xl">
            <div className="flex w-full items-center gap-3 px-4 lg:px-7">
                <SidebarTrigger aria-label="Abrir o cerrar navegación" className="-ml-1" />
                <Separator orientation="vertical" className="h-7" />
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                        <BookOpen aria-hidden="true" />
                    </span>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold tracking-[0.12em]">SIBI</p>
                        <p className="hidden text-xs text-muted-foreground sm:block">Sistema de bibliotecas</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <ModeToggle />
                    <UserMenu user={user} />
                </div>
            </div>
        </header>
    );
}
