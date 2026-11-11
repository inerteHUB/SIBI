"use client";

// react
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// componentes ui
import { toast } from "sonner";

// service
import { servicePermissionEdit } from "../services/servicePermissionEdit";

// tipado
import { PermissionEdit } from "../type/typePermissionEdit";

const formSchemaPermission = z.object({
  name: z.string().min(4, {
    message: "El nombre es requerido",
  }),
})

export const usePermissionEdit = (id: number, refreshPermissions: () => void, stopEditing: () => void) => {
    const [loading, setLoading] = useState(false);
  
    const formPermission = useForm<PermissionEdit>({
      resolver: zodResolver(formSchemaPermission),
      defaultValues: { name: "" },
    })
  
    const editPermission = async (data: PermissionEdit) => {
      setLoading(true);
  
      try {
        await servicePermissionEdit(id, data);
        toast.success("Registro actualizado con exito");
        refreshPermissions();
        stopEditing();
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Error al actualizar");
        }
      } finally {
        setLoading(false);
      }
    };
  
    return { formPermission, editPermission, loading };
};

export const usePermissionEditState = () => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const startEditing = (id: number) => setEditingId(id);
  const stopEditing = () => setEditingId(null);

  const isEditing = (id: number) => editingId === id;

  return { editingId, startEditing, stopEditing, isEditing };
};
