import { useState } from "react";
import { toast } from "sonner";
import { serviceUserView } from "../services/serviceUserView";
import { UserView } from "../type/typeUserView";

export const useUserView = () => {
    const [user, setUser]       = useState<UserView | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUser = async (id: number) => {
        setLoading(true);
        try {
            const data = await serviceUserView(id);
            setUser(data);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al obtener el Usuario");
        } finally {
            setLoading(false);
        }
    };

    return { user, fetchUser, loading };
};