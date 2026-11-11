import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDependencyDelete } from "../hooks/useDependencyDelete";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    refreshDependencies: () => void;
};

export default function UiDependencyDelete({ open, onOpenChange, id, refreshDependencies }: Props) {
    const { deleteDependency, loading } = useDependencyDelete(refreshDependencies);

    const handleConfirm = async () => {
        if (!id) return;
        await deleteDependency(id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        La Dependencia será eliminada permanentemente del sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                        {loading ? "Eliminando..." : "Continuar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}