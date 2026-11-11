// componentes ui
import { toast } from "sonner";

// react
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// service
import { serviceLogin } from "./serviceLogin";

// tipado
import { Login } from "./typeLogin";
import { useRouter } from "next/navigation";

const SchemaLogin = z.object({
    username: z.string().min(4, {
        message: "El usuario es requerido",
    }),
    password: z.string().min(4, {
        message: "La contraseña es requerida",
    }),
})

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const formLogin = useForm<Login>({
        resolver: zodResolver(SchemaLogin),
        defaultValues: { username: "", password: "", },
    })

    const login = async (data: Login) => {
        setLoading(true);

        try {
            const res = await serviceLogin(data);
            localStorage.setItem("token", res.access_token);
            router.push("/modules");
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Error al iniciar sesion");
            }
            setLoading(false);
        }
    };

    return { formLogin, login, loading, setLoading };
};