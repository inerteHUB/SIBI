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

// iconos
import { Trash } from "lucide-react";

// hooks
import { useModuleDelete } from "../hooks/useModuleDelete";

type Props = {
    id: number;
    refreshModules: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function UiModuleDelete({ id, refreshModules, open, onOpenChange }: Props) {
    const { deleteModule, loading } = useModuleDelete(refreshModules);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Esta seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        El módulo sera eliminado permanentemente del sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel disabled={loading}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteModule(id)} disabled={loading}>
                        Continuar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}