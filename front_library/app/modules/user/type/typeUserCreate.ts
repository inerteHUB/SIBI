import { UserBase } from "./typeUserBase";

export interface UserCreate extends UserBase {
    password: string;
}