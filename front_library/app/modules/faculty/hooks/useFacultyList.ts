import { useState } from "react";
import { FacultyList } from "../type/typeFacultyList";
import { serviceFacultyList } from "../services/serviceFacultyList";

export const useFacultyList = () => {
  const [Faculties, setFaculties] = useState<FacultyList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await serviceFacultyList();
      setFaculties(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return { Faculties, setFaculties, loading, error, refreshFaculties: fetchData };
};
