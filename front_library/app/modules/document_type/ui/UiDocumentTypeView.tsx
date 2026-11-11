import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LoadingText } from "@/components/loading";
import { DocumentTypeView } from "../type/typeDocumentTypeView";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: DocumentTypeView | null;
    loading: boolean;
};

const badgeVariantMap: Record<string, "default" | "warning" | "destructive"> = {
    Activo:        "default",
    Deshabilitado: "warning",
    Eliminado:     "destructive",
};

export default function UiDocumentTypeView({ open, onOpenChange, documentType, loading }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Visualizar Tipo de Documento</SheetTitle>
                </SheetHeader>
                {loading ? (
                    <div className="px-4 pt-4"><LoadingText /></div>
                ) : !documentType ? (
                    <p className="px-4 pt-4 text-muted-foreground text-sm">No se encontró el Tipo de Documento.</p>
                ) : (
                    <div className="space-y-3 px-4 pt-4 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Nombre</p>
                            <p className="font-medium">{documentType.name}</p>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}