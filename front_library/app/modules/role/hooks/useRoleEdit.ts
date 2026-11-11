"use client";

import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { serviceRoleEdit } from "../services/serviceRoleEdit";
import { RoleEdit } from "../type/typeRoleEdit";
import { RoleView } from "../type/typeRoleView";
import { SelectedModule } from "../type/typeRoleCreate";

// Reutilizar el mismo esquema de validación que en create
const SelectedModuleSchema = z.object({
  moduleId: z.number(),
  permissionIds: z.array(z.number()).min(1, {
    message: "Debe seleccionar al menos un permiso para este módulo.",
  }),
});

export const SchemaRoleUpdate = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio." })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  description: z
    .string()
    .min(1, { message: "La descripción es obligatoria." })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  modules: z
    .array(SelectedModuleSchema)
    .min(1, { message: "Debe asignar permisos a al menos un módulo." })
    .refine((modules) => modules.some((mod) => mod.permissionIds.length > 0), {
      message: "Debe seleccionar al menos un permiso en al menos un módulo.",
    }),
});

type RoleUpdateFormValues = z.infer<typeof SchemaRoleUpdate>;

// Convierte role_permissions del API al formato del formulario
const buildInitialModules = (role: RoleView): SelectedModule[] => {
  const map = new Map<number, SelectedModule>();

  role.role_permissions.forEach((rp) => {
    const moduleId = rp.module_permission.module_id;
    const mpId = rp.module_permission_id; // este ID es lo que el form almacena como permissionId

    if (!map.has(moduleId)) {
      map.set(moduleId, { moduleId, permissionIds: [] });
    }
    map.get(moduleId)!.permissionIds.push(mpId);
  });

  return Array.from(map.values());
};

export const useRoleEdit = (
  refreshRoles: () => void,
  setOpen: (open: boolean) => void
) => {
  const [loading, setLoading] = useState(false);

  const formRole = useForm<RoleUpdateFormValues>({
    resolver: zodResolver(SchemaRoleUpdate),
    defaultValues: { name: "", description: "", modules: [] },
  });

  // Precarga el formulario con los datos del rol existente
  const loadRole = (role: RoleView) => {
    formRole.reset({
      name: role.name,
      description: role.description,
      modules: buildInitialModules(role),
    });
  };

  const updateRole = async (id: number, data: RoleEdit) => {
    setLoading(true);
    try {
      await serviceRoleEdit(id, data);
      refreshRoles();
      toast.success("Rol actualizado con éxito");
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error al actualizar el rol");
      }
    } finally {
      setLoading(false);
    }
  };

  return { formRole, loadRole, updateRole, loading };
};