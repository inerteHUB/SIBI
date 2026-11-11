import { FacultyBase } from "./typeFacultyBase";

export interface FacultyList extends FacultyBase {
    id: number;
    logo: string | null;
    stamp: string | null;
    state: string;
}