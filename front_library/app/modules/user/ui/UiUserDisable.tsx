import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useUserDisable } from "../hooks/useUserDisable";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; id: number | null; refreshUsers: () => void };

export default function UiUserDisable({ open, onOpenChange, id, refreshUsers }: Props) {
    const { disableUser, loading } = useUserDisable(refreshUsers);

    const handleConfirm = async () => {
        if (!id) return;
        await disableUser(id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader variant="warning">
                    <AlertDialogTitle className="text-center">¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        El Usuario será deshabilitado del sistema.
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