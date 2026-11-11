"use client";

// react
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// componentes ui
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/loading";

//iconos
import { IoMdArrowRoundBack } from "react-icons/io";

// hooks
import { useLogin } from "./useLogin";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
    const { formLogin, login, loading, setLoading } = useLogin();
    const isAuthenticated = useAuth();
    const router = useRouter();

    const handleWebRedirect = () => {
        setLoading(true);
        router.push("/");
    };
    
    const handleRegisterRedirect = () => {
        setLoading(true);
        router.push("/register");
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/modules/");
        }
    }, [isAuthenticated, router]);

    if (loading && isAuthenticated === true) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-between gap-2">
                    <div className="flex items-center">
                        <Button onClick={handleWebRedirect} variant="outline" size="sm">
                            <IoMdArrowRoundBack />
                        </Button>
                        <div className="text-2xl ml-2">SIBI</div>
                    </div>
                    <ModeToggle />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Inicie sesion</h1>
                                <p className="text-balance text-sm text-muted-foreground">
                                    Ingrese sus credenciales para acceder al sistema
                                </p>
                            </div>
                            <div className="grid gap-6">
                                <Form {...formLogin}>
                                    <form onSubmit={formLogin.handleSubmit(login)} className="grid gap-6">
                                        <FormField
                                            control={formLogin.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Usuario</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" {...field} />
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
                                                    <div className="flex items-center">
                                                        <FormLabel>Contraseña</FormLabel>
                                                        <a
                                                            href="#"
                                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                                        >
                                                            Olvidaste tu contraseña?
                                                        </a>
                                                    </div>
                                                    <FormControl>
                                                        <Input type="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full">
                                            Acceder
                                        </Button>
                                    </form>
                                </Form>
                                <div className="text-center text-sm">
                                    ¿No tienes una cuenta?{" "}
                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRegisterRedirect();
                                        }} 
                                        className="underline underline-offset-4 cursor-pointer"
                                    >
                                        Registrar Facultad
                                    </a>
                                </div>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                        Terminos y condiciones
                                    </span>
                                </div>
                                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
                                    <a className="hover:text-primary" href="#">Terminos de Servicio</a>{" "}
                                    y <a className="hover:text-primary" href="#">Politicas de Privacidad</a>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="/avatars/shadcn.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}