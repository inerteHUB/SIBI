import { FacultyBase } from "./typeFacultyBase";

export interface FacultyView extends FacultyBase {
    id: number;
    logo: string | null;
    stamp: string | null;
    state: string;
}