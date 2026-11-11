"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceRoleView } from "../services/serviceRoleView";
import { RoleView } from "../type/typeRoleView";

const roleDefault: RoleView = {
  id: 0,
  name: "",
  description: "",
  role_permissions: [],
};

export const useRoleView = () => {
  const [role, setRole] = useState<RoleView>(roleDefault);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRole = async (id: number) => {
    setLoading(true);
    try {
      const data: RoleView = await serviceRoleView(id);
      setRole(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error al obtener el rol");
      }
    } finally {
      setLoading(false);
    }
  };

  return { role, fetchRole, loading };
};