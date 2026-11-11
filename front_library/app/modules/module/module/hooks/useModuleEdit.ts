"use client";

// componentes ui
import { toast } from "sonner";

// react
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// service
import { serviceModuleEdit } from "../services/serviceModuleEdit";

// tipado
import { ModuleEdit } from "../type/typeModuleEdit";

const SchemaModule = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  is_parent: z.boolean(),
  path: z.string().nullable(),
  parent_id: z.number().nullable(),
  icon: z.instanceof(File).nullable(),
  remove_icon: z.boolean(),
})
  .refine((data) => {
    if (!data.is_parent && (!data.path || data.path.trim() === "")) return false;
    return true;
  }, {
    message: "La ruta es requerida",
    path: ["path"],
  });

export const useModuleEdit = (id: number, refreshModules: () => void) => {
  const [loading, setLoading] = useState(false);
  const [resetPreviewSignal, setResetPreviewSignal] = useState(0);

  const formModule = useForm<ModuleEdit>({
    resolver: zodResolver(SchemaModule),
    defaultValues: {
      name: "",
      path: "",
      is_parent: false,
      parent_id: null,
      icon: null,
      remove_icon: false,
    },
  });

  const editModule = async (data: ModuleEdit) => {
    setLoading(true);

    try {
      await serviceModuleEdit(id, data);
      refreshModules();
      setResetPreviewSignal(x => x + 1);
      toast.success("Registro actualizado con exito");
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

  return { formModule, editModule, loading, resetPreviewSignal };
};