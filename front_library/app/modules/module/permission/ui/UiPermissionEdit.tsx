"use client";

// react
import { useEffect } from "react";

// componentes ui
import { Button } from "@/components/ui/button";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormMessage 
} from "@/components/ui/form";

// iconos
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel, MdOutlineSecurity } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";

// hooks
import { usePermissionView } from "../hooks/usePermissionView";
import { usePermissionEdit } from "../hooks/usePermissionEdit";

type Props = {
    id: number;
    startEditing: (id: number) => void;
};

// boton editar
export function UiPermissionEdit({ id, startEditing }: Props) {
    return (
        <Button className="h-8 w-8 mr-2" variant="outline" onClick={() => startEditing(id)}>
            <AiOutlineEdit />
        </Button>
    );
}

// formulario editar
type PropsForm = {
    id: number;
    stopEditing: () => void;
    refreshPermissions: () => void;
};

export function UiPermissionEditForm({ id, stopEditing, refreshPermissions }: PropsForm) {
    const { permission, fetchPermission, loading: loadingView } = usePermissionView();
    const { formPermission, editPermission, loading: loadingEdit } = usePermissionEdit(id, refreshPermissions, stopEditing);

    useEffect(() => {
        fetchPermission(id);
    }, [id]);

    useEffect(() => {
        if (permission) {
            formPermission.reset({ name: permission.name });
        }
    }, [permission]);

    if (loadingView || loadingEdit) return <p>Cargando...</p>;

    return (
        <Form {...formPermission}>
            <form onSubmit={formPermission.handleSubmit(editPermission)} className="flex items-center gap-3 w-full">
                <FormField
                    control={formPermission.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <div className="flex items-center gap-3">
                                <MdOutlineSecurity className="text-primary ml-1" />
                                <FormControl>
                                    <input
                                        {...formPermission.register("name")}
                                        className="flex-1 w-[130px] px-2 py-1 border rounded-md"
                                        autoComplete="off"
                                        placeholder="Nombre"
                                        {...field}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-2">
                    <Button
                        type="submit"
                        variant="outline"
                        className="h-8 w-8 mr-2"
                        disabled={loadingEdit}
                    >
                        <FaRegSave />
                    </Button>
                    <Button
                        type="button"
                        variant="outlineDestructive"
                        className="h-8 w-8"
                        onClick={stopEditing}
                    >
                        <MdOutlineCancel />
                    </Button>
                </div>
            </form>
        </Form>
    );
}