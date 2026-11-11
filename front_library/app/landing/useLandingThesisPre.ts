"use client";

import { useState } from "react";
import { toast } from "sonner";
import { serviceSearchThesisPre, serviceViewThesisPre } from "./serviceLandingThesisPre";
import { SearchResultItem, ThesisPreDetailPublic } from "./typeLandingThesisPre";

export const useLandingThesisPreSearch = () => {
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [total, setTotal]     = useState(0);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const search = async (q: string, page: number = 1) => {
        setLoading(true);
        try {
            const data = await serviceSearchThesisPre(q, page);
            setResults(data.results);
            setTotal(data.total);
            setSearched(true);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Error al buscar tesis");
        } finally {
            setLoading(false);
        }
    };

    return { results, total, loading, searched, search };
};

export const useLandingThesisPreDetail = () => {
    const [thesis, setThesis]   = useState<ThesisPreDetailPublic | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchThesis = async (id: number) => {
        setLoading(true);
        try {
            const data = await serviceViewThesisPre(id);
            setThesis(data);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "No se encontró la tesis");
        } finally {
            setLoading(false);
        }
    };

    return { thesis, fetchThesis, loading };
};
