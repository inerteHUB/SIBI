import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useUserDelete } from "../hooks/useUserDelete";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; id: number | null; refreshUsers: () => void };

export default function UiUserDelete({ open, onOpenChange, id, refreshUsers }: Props) {
    const { deleteUser, loading } = useUserDelete(refreshUsers);

    const handleConfirm = async () => {
        if (!id) return;
        await deleteUser(id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        El Usuario será eliminado permanentemente del sistema.
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