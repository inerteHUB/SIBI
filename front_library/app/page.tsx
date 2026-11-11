"use client";

// react
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";

// componentes ui
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading";

// hooks
import { ModeToggle } from "@/components/mode-toggle";

// iconos
import { GraduationCap, Search } from "lucide-react"

export default function HomePage() {
    const router = useRouter();
    const [ loading, setLoading ] = useState(false);

    const handleLoginRedirect = () => {
        setLoading(true);
        router.push("/auth/login");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="border-b bg-background sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        <span className="font-bold text-xl">SIBI</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                    </nav>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <Link href="/landing/search">
                            <Button variant="ghost" size="sm" className="gap-1.5">
                                <Search className="size-4" />
                                Transparencia
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleLoginRedirect}>
                            Iniciar sesión
                        </Button>
                        <Link href="/">
                            <Button size="sm">Cuenta demo</Button>
                        </Link>
                    </div>
                </div>
            </header>
            {/* Footer */}
            <footer>
            </footer>
        </div>
    );
}