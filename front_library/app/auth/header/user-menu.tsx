"use client";

import { apiBackend } from "@/config/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconLogout, IconNotification, IconSettings, IconUserCircle } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/hooks/use-logout";
import { LoadingSpinner } from "@/components/loading";
import { HeaderUser } from "../typeSystemData";

type Props = {
    user: HeaderUser;
};

export default function UserMenu({ user }: Props) {
    const { logout, loading: loadingLogout } = useLogout();

    const initials = user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase() ?? "??";

    if (loadingLogout) {
        return (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-background">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="ml-2 cursor-pointer">
                    <AvatarImage src={`${apiBackend}/${user.avatar}`} alt={user?.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <IconUserCircle />
                        Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconSettings />
                        Configuracion
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconNotification />
                        Notificaciones
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <IconLogout />
                    Cerrar sesion
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
