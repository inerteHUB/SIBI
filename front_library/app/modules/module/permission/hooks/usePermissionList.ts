import { useState } from "react";
import { PermissionList } from "../type/typePermissionList";
import { servicePermissionList } from "../services/servicePermissionList";

export const usePermissionList = () => {
  const [permissions, setPermissions] = useState<PermissionList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await servicePermissionList();
      setPermissions(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return { permissions, setPermissions, loading, error, refreshPermissions: fetchData };
};
