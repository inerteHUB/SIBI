import { UserBase } from "./typeUserBase";

export interface UserView extends UserBase {
    id: number;
    avatar: string | null;
    root: boolean;
    state: string;
}