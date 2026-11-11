import { DependencyBase } from "./typeDependencyBase";

export interface DependencyView extends DependencyBase {
    id: number;
    logo: string | null;
    stamp: string | null;
    state: string;
}