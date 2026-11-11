// react
import { useState } from "react";

// componentes ui
import { toast } from "sonner";

// service
import { serviceModuleView } from "../services/serviceModuleView";

// tipado
import { ModuleView } from "../type/typeModuleView";

const moduleDefault = { id: null, name: "", path: "", is_parent: false, parent_id:null, icon: null};

export const useModuleView = () => {
    const [module, setModule] = useState<ModuleView>(moduleDefault);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchModule = async (id: number) => {
        setLoading(true);

        try {
            const data = await serviceModuleView(id);
            setModule(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Error al obtener el módulo");
            }
        } finally {
            setLoading(false);
        }
    };

    return { module, fetchModule, loading };
};