"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { serviceUserChangePassword } from "../services/serviceUserChangePassword";

const SchemaPassword = z
    .object({
        new_password:     z.string().min(6, "Mínimo 6 caracteres"),
        confirm_password: z.string().min(6, "Mínimo 6 caracteres"),
    })
    .refine((d) => d.new_password === d.confirm_password, {
        message: "Las contraseñas no coinciden",
        path: ["confirm_password"],
    });

export type ChangePasswordForm = z.infer<typeof SchemaPassword>;

export const useUserChangePassword = (id: number, onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const formPassword = useForm<ChangePasswordForm>({
        resolver: zodResolver(SchemaPassword),
        defaultValues: { new_password: "", confirm_password: "" },
    });

    const changePassword = async (data: ChangePasswordForm) => {
        setLoading(true);
        try {
            await serviceUserChangePassword(id, data.new_password);
            formPassword.reset();
            toast.success("Contraseña actualizada con éxito");
            onSuccess();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return { formPassword, changePassword, loading };
};