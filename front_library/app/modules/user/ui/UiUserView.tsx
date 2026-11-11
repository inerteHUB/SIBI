import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { LoadingText } from "@/components/loading";
import { apiBackend } from "@/config/constants";
import { UserView } from "../type/typeUserView";
import { FormItem } from "../type/typeUserForm";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserView | null;
    loading: boolean;
    formData: { faculties: FormItem[]; roles: FormItem[]; specializations: FormItem[] };
};

const badgeVariantMap: Record<string, "default" | "warning" | "destructive"> = {
    Activo: "default", Deshabilitado: "warning", Eliminado: "destructive",
};

export default function UiUserView({ open, onOpenChange, user, loading, formData }: Props) {
    const getFacultyName = (id: number | null) =>
        id ? (formData.faculties.find((f) => f.id === id)?.name ?? "—") : "—";

    const getRoleName  = (id: number) => formData.roles.find((r) => r.id === id)?.name ?? String(id);
    const getSpecName  = (id: number) => formData.specializations.find((s) => s.id === id)?.name ?? String(id);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Visualizar Usuario</SheetTitle>
                </SheetHeader>
                {loading ? (
                    <div className="px-4 pt-4"><LoadingText /></div>
                ) : !user ? (
                    <p className="px-4 pt-4 text-muted-foreground text-sm">No se encontró el Usuario.</p>
                ) : (
                    <div className="space-y-4 px-4 pt-4 text-sm">
                        {/* Avatar */}
                        <div className="flex justify-center py-2">
                            {user.avatar ? (
                                <img src={`${apiBackend}/${user.avatar}`} alt="Avatar" className="h-24 w-24 rounded-full border object-cover" />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-muted text-xs text-muted-foreground">
                                    Sin foto
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Facultad</p>
                                <p className="font-medium">{getFacultyName(user.faculty_id)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Nombre</p>
                                    <p className="font-medium">{user.name} {user.last_name ?? ""}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Apellidos</p>
                                    <p className="font-medium">{user.paternal_surname} {user.maternal_surname ?? ""}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Usuario</p>
                                    <p className="font-mono">{user.username}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">DNI</p>
                                    <p className="font-mono">{user.dni}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p>{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Teléfono</p>
                                    <p>{user.phone}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Género</p>
                                    <p>{user.gender === "M" ? "Masculino" : "Femenino"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Fecha de Nacimiento</p>
                                    <p>{user.birthdate ?? "—"}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Dirección</p>
                                <p>{user.address ?? "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Roles</p>
                                <div className="flex flex-wrap gap-1">
                                    {user.role_ids.map((id) => (
                                        <Badge key={id} variant="secondary" className="text-xs">{getRoleName(id)}</Badge>
                                    ))}
                                </div>
                            </div>
                            {user.specialization_ids.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Especializaciones</p>
                                    <div className="flex flex-wrap gap-1">
                                        {user.specialization_ids.map((id) => (
                                            <Badge key={id} variant="outline" className="text-xs">{getSpecName(id)}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-muted-foreground">Estado</p>
                                <Badge variant={badgeVariantMap[user.state] ?? "secondary"} className="text-xs mt-1">
                                    {user.state}
                                </Badge>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}