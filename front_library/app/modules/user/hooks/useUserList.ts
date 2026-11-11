import { useState } from "react";
import { UserList } from "../type/typeUserList";
import { serviceUserList } from "../services/serviceUserList";

export const useUserList = () => {
    const [Users, setUsers]     = useState<UserList[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await serviceUserList();
            setUsers(data);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return { Users, loading, error, refreshUsers: fetchData };
};