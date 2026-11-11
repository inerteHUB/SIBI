// componentes ui
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// iconos
import { Trash2 } from "lucide-react";

// hooks
import { useRoleDelete } from "../hooks/useRoleDelete";

type Props = {
    id: number;
    refreshRoles: () => void;
    disabled?: boolean;
};

export default function UiRoleDelete({ id, refreshRoles, disabled }: Props) {
    const { deleteRole, loading } = useRoleDelete(refreshRoles);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={disabled}>
                    <Trash2/> Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Esta seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        El permiso sera eliminado permanentemente del sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel disabled={loading}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteRole(id)} disabled={loading}>
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}