import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDependencyDisable } from "../hooks/useDependencyDisable";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    refreshDependencies: () => void;
};

export default function UiDependencyDisable({ open, onOpenChange, id, refreshDependencies }: Props) {
    const { disableDependency, loading } = useDependencyDisable(refreshDependencies);

    const handleConfirm = async () => {
        if (!id) return;
        await disableDependency(id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        La Dependencia será deshabilitada del sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                        {loading ? "Deshabilitando..." : "Continuar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}