import { UserBase } from "./typeUserBase";

export interface UserList extends UserBase {
    id: number;
    avatar: string | null;
    root: boolean;
    state: string;
}