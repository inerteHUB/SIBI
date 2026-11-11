// componentes ui
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

// hooks
import { useFacultyDelete } from "../hooks/useFacultyDelete";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    refreshFaculties: () => void;
};

export default function UiFacultyDelete({ open, onOpenChange, id, refreshFaculties }: Props) {
    const { deleteFaculty, loading } = useFacultyDelete(refreshFaculties);

    const handleConfirm = async () => {
        if (!id) return;
        await deleteFaculty(id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Esta seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        La Facultad sera eliminada permanentemente del sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel disabled={loading}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                        {loading ? "Eliminando..." : "Continuar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}