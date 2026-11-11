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
import { usePermissionDelete } from "../hooks/usePermissionDelete";

type Props = {
    id: number;
    refreshPermissions: () => void;
};

export default function UiPermissionDelete({ id, refreshPermissions }: Props) {
    const { deletePermission, loading } = usePermissionDelete(refreshPermissions);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="h-8 w-8" variant="outlineDestructive">
                    <Trash2/>
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
                    <AlertDialogAction onClick={() => deletePermission(id)} disabled={loading}>
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}