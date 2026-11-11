"use client";

// componentes ui
import { toast } from "sonner";

// react
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// service
import { serviceModuleCreate } from "../services/serviceModuleCreate";

// tipado
import { ModuleCreate } from "../type/typeModuleCreate";

const SchemaModule = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  is_parent: z.boolean(),
  path: z.string().nullable(),
  parent_id: z.number().nullable(),
  icon: z.instanceof(File).nullable(),
})
  .refine((data) => {
    if (!data.is_parent && (!data.path || data.path.trim() === "")) return false;
    return true;
  }, {
    message: "La ruta es requerida",
    path: ["path"],
  });

export const useModuleCreate = (refreshModules: () => void) => {
  const [loading, setLoading] = useState(false);
  const [resetPreviewSignal, setResetPreviewSignal] = useState(0);

  const formModule = useForm<ModuleCreate>({
    resolver: zodResolver(SchemaModule),
    defaultValues: {
      name: "",
      path: "",
      is_parent: false,
      parent_id: null,
      icon: null,
    },
  });

  const createModule = async (data: ModuleCreate) => {
    setLoading(true);

    try {
      await serviceModuleCreate(data);
      refreshModules();
      formModule.reset();
      setResetPreviewSignal(x => x + 1);
      toast.success("Registro realizado con exito");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error al registrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return { formModule, createModule, loading, resetPreviewSignal };
};