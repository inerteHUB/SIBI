import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { serviceSystemData } from "./serviceSystemData";
import { SystemData } from "./typeSystemData";

export const useSystemData = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchSystemData = async () => {
        setLoading(true);
        try {
            const data = await serviceSystemData();
            setData(data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Error al obtener datos del sistema";

            if (errorMessage === 'No se pudo validar las credenciales') {
                localStorage.removeItem('token'); 
                toast.error("Sesión expirada. Redirigiendo al login...");
                router.replace('/auth/login');
            } else {
                // Mostrar cualquier otro error normalmente
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return { data, fetchSystemData, loading };
};
