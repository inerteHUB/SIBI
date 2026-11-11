export type HeaderUser = {
    name: string;
    email: string;
    avatar: string;
};

export type SidebarModule = {
    id: number;
    name: string;
    path: string | null;
    icon: string;
    is_parent: boolean;
    parent_id: number | null;
};

export type SystemData = {
    user: HeaderUser;
    modules: SidebarModule[];
};