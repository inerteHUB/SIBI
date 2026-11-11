// componentes ui
import { LoadingText } from "@/components/loading";

// iconos
import { MdOutlineSecurity } from "react-icons/md";

// tipado
import { PermissionList } from "../type/typePermissionList";

// componentes
import UiPermissionDelete from "./UiPermissionDelete";
import { UiPermissionEdit, UiPermissionEditForm } from "./UiPermissionEdit";

// hooks
import { usePermissionEditState } from "../hooks/usePermissionEdit";

type Props = {
    permissions: PermissionList[];
    loading: boolean;
    error: string | null;
    refreshPermissions: () => void;
};

export default function UiPermissionList({ permissions, loading, error, refreshPermissions }: Props) {
    const { isEditing, startEditing, stopEditing } = usePermissionEditState();
    
    if (loading) return <LoadingText />;
    if (error) return <p className="text-destructive-base">{error}</p>;
    
    return (
        <div className="space-y-4 text-sm mb-6">
            <h3 className="font-medium">Permisos Actuales</h3>
            { permissions.length > 0 ? (
                permissions.map((permission) => (
                    <div 
                        key={permission.id} 
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/20 transition-colors"
                    >
                        {isEditing(permission.id) ? (
                            <UiPermissionEditForm 
                                id={permission.id} 
                                stopEditing={stopEditing} 
                                refreshPermissions={refreshPermissions} 
                            />
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <MdOutlineSecurity className="text-primary ml-1" />
                                    {permission.name}
                                </div>
                                <div className="flex gap-2">
                                    <UiPermissionEdit id={permission.id} startEditing={startEditing} />
                                    <UiPermissionDelete 
                                        id={permission.id} 
                                        refreshPermissions={refreshPermissions} 
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-muted-foreground text-base">No hay permisos registrados</div>
            )}
        </div>
    );
}