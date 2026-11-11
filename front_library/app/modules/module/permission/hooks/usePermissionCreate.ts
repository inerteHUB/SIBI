"use client";

// componentes ui
import { toast } from "sonner";

// react
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// service
import { servicePermissionCreate } from "../services/servicePermissionCreate";

// tipado
import { PermissionCreate } from "../type/typePermissionCreate";

const SchemaPermission = z.object({
  name: z.string().min(4, {
    message: "El nombre es requerido",
  }),
})

export const usePermissionCreate = (refreshPermissions: () => void) => {
  const [loading, setLoading] = useState(false);

  const formPermission = useForm<PermissionCreate>({
    resolver: zodResolver(SchemaPermission),
    defaultValues: { name: "" },
  })

  const createPermission = async (data: PermissionCreate) => {
    setLoading(true);

    try {
      await servicePermissionCreate(data);
      refreshPermissions();
      formPermission.reset();
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

  return { formPermission, createPermission, loading };
};
