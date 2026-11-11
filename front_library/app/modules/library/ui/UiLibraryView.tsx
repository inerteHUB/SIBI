import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LoadingText } from "@/components/loading";
import { LibraryView } from "../type/typeLibraryView";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    library: LibraryView | null;
    loading: boolean;
};

const badgeVariantMap: Record<string, "default" | "warning" | "destructive"> = {
    Activo:        "default",
    Deshabilitado: "warning",
    Eliminado:     "destructive",
};

export default function UiLibraryView({ open, onOpenChange, library, loading }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Visualizar Biblioteca</SheetTitle>
                </SheetHeader>
                {loading ? (
                    <div className="px-4 pt-4"><LoadingText /></div>
                ) : !library ? (
                    <p className="px-4 pt-4 text-muted-foreground text-sm">No se encontró la Biblioteca.</p>
                ) : (
                    <div className="space-y-3 px-4 pt-4 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Nombre</p>
                            <p className="font-medium">{library.name}</p>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}