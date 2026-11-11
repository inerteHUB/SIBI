import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LoadingText } from "@/components/loading";
import { SpecializationView } from "../type/typeSpecializationView";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    specialization: SpecializationView | null;
    loading: boolean;
};

const badgeVariantMap: Record<string, "default" | "warning" | "destructive"> = {
    Activo:        "default",
    Deshabilitado: "warning",
    Eliminado:     "destructive",
};

export default function UiSpecializationView({ open, onOpenChange, specialization, loading }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Visualizar Especialización</SheetTitle>
                </SheetHeader>
                {loading ? (
                    <div className="px-4 pt-4"><LoadingText /></div>
                ) : !specialization ? (
                    <p className="px-4 pt-4 text-muted-foreground text-sm">No se encontró la Especialización.</p>
                ) : (
                    <div className="space-y-3 px-4 pt-4 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Nombre</p>
                            <p className="font-medium">{specialization.name}</p>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}