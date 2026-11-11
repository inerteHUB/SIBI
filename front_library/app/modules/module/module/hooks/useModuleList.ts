import { useState } from "react";
import { ModuleList } from "../type/typeModuleList";
import { serviceModuleList } from "../services/serviceModuleList";

export const useModuleList = () => {
  const [modules, setModules] = useState<ModuleList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await serviceModuleList();
      setModules(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return { modules, setModules, loading, error, refreshModules: fetchData };
};
