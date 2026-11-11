import { useState } from "react";
import { RoleList } from "../type/typeRoleList";
import { serviceRoleList } from "../services/serviceRoleList";

export const useRoleList = () => {
  const [roles, setRoles] = useState<RoleList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await serviceRoleList();
      setRoles(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return { roles, setRoles, loading, error, refreshRoles: fetchData };
};
