import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { LoadingText } from "@/components/loading";
import { apiBackend } from "@/config/constants";
import { FacultyView } from "../type/typeFacultyView";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faculty: FacultyView | null;
    loading: boolean;
};

function ImageBlock({ src, alt }: { src: string | null; alt: string }) {
    return src ? (
        <img src={`${apiBackend}/${src}`} alt={alt} className="h-24 w-24 rounded border object-contain" />
    ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
            Sin imagen
        </div>
    );
}

export default function UiFacultyView({ open, onOpenChange, faculty, loading }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Visualizar Facultad</SheetTitle>
                </SheetHeader>
                {loading ? (
                    <div className="px-4 pt-4"><LoadingText /></div>
                ) : !faculty ? (
                    <p className="px-4 pt-4 text-muted-foreground text-sm">No se encontró la Facultad.</p>
                ) : (
                    <div className="space-y-4 px-4 pt-4 text-sm">
                        <div className="flex justify-center gap-6 py-2">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs text-muted-foreground">Logo</span>
                                <ImageBlock src={faculty.logo} alt="Logo" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs text-muted-foreground">Sello</span>
                                <ImageBlock src={faculty.stamp} alt="Sello" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Nombre</p>
                                <p className="font-medium">{faculty.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Abreviatura</p>
                                <p className="font-mono font-medium">{faculty.abbreviation}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Estado</p>
                                <Badge variant={faculty.state === "Activo" ? "default" : "secondary"} className="text-xs mt-1">
                                    {faculty.state}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}