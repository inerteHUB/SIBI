"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useUserChangePassword } from "../hooks/useUserChangePassword";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: number | null;
};

export default function UiUserChangePassword({ open, onOpenChange, userId }: Props) {
    const { formPassword, changePassword, loading } = useUserChangePassword(
        userId ?? 0,
        () => onOpenChange(false),
    );

    useEffect(() => {
        if (open) formPassword.reset();
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Cambiar Contraseña</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4 pt-4">
                    <Form {...formPassword}>
                        <form onSubmit={formPassword.handleSubmit(changePassword)} className="space-y-4">
                            <FormField
                                control={formPassword.control}
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nueva Contraseña <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="password" autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={formPassword.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Contraseña <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="password" autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between items-center mt-8">
                                <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                                    <IoMdCloseCircleOutline className="size-5" /> Cerrar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    <FaRegSave />
                                    {loading ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}