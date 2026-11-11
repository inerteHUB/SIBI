import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDependencyEnable } from "../hooks/useDependencyEnable";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    refreshDependencies: () => void;
};

export default function UiDependencyEnable({ open, onOpenChange, id, refreshDependencies }: Props) {
    const { enableDependency, loading } = useDependencyEnable(refreshDependencies);

    const handleConfirm = async () => {
        if (!id) return;
        await enableDependency(id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        La Dependencia será habilitada en el sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                        {loading ? "Habilitando..." : "Continuar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}