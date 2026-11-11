import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDocumentTypeDelete } from "../hooks/useDocumentTypeDelete";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number | null;
    refreshDocumentTypes: () => void;
};

export default function UiDocumentTypeDelete({ open, onOpenChange, id, refreshDocumentTypes }: Props) {
    const { deleteDocumentType, loading } = useDocumentTypeDelete(refreshDocumentTypes);

    const handleConfirm = async () => {
        if (!id) return;
        await deleteDocumentType(id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        El tipo de documento será eliminado permanentemente del sistema.
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