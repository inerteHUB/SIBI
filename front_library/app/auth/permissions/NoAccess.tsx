import { ShieldX } from "lucide-react";

type Props = {
    module_name: string;
};

export default function NoAccess({module_name}: Props) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
            <ShieldX className="h-20 w-20 text-muted-foreground/50" />
            <p className="text-lg font-semibold">No tiene acceso al Módulo {module_name}</p>
            <p className="text-sm text-muted-foreground max-w-xs">
                No tienes Acceso a este módulo. Contacta al administrador si crees que es un error.
            </p>
            <p className="text-base max-w-xs">
                +51 917 652 293
            </p>
        </div>
    );
}
