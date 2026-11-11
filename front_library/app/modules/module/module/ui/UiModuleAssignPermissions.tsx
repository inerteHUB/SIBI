// react
import { useEffect, useState } from "react";

// componentes ui
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

// iconos
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

// hook
import { useModuleAssignPermissions } from "../hooks/useModuleAssignPermissions";

// tipado
import { PermissionList } from "../../permission/type/typePermissionList";
import { useModuleGetPermissions } from "../hooks/useModuleGetPermissions";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleGetPermissions } from "../type/typeModuleGetPermissions";
import { MdOutlineViewModule } from "react-icons/md";
import { apiBackend } from "@/config/constants";

type Props = {
  moduleId: number;
  moduleName: string;
  modulePath: string | null;
  moduleIcon: string | null;
  permissions: PermissionList[];
  loadingPermissions: boolean;
  errorPermissions: string | null;
  refreshPermissions: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UiModuleAssignPermissions(
  {
    moduleId,
    moduleName,
    modulePath,
    moduleIcon,
    permissions,
    loadingPermissions,
    errorPermissions,
    refreshPermissions,
    open,
    onOpenChange
  }: Props) {
    
  const { assignPermissions, loading } = useModuleAssignPermissions(moduleId);
  const { fetchGetPermissions, loading: loadingGetPermissions } = useModuleGetPermissions();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    if (open && moduleId) {
      const initLoad = async () => {
        // 1. Limpiar estado visual previo
        setSelectedPermissions([]); 
        
        // 2. Disparar recarga de la lista global de permisos
        refreshPermissions();

        // 3. Traer los permisos ESPECÍFICOS de este módulo
        const data = await fetchGetPermissions(moduleId);
        
        if (data) {
          // Aquí seteamos los IDs que vienen de la BD
          setSelectedPermissions(data.permission_ids);
        }
      };
      
      initLoad();
    }
  }, [open, moduleId]);

  const handlePermissionChange = (permId: number, checked: boolean | "indeterminate") => {
    setSelectedPermissions(prev => {
      if (checked === true) return [...prev, permId];
      return prev.filter(id => id !== permId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await assignPermissions(selectedPermissions);
    if (success) {
      onOpenChange(false);
    }
  };

  const isLoadingData = loadingPermissions || loadingGetPermissions;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l">
        <SheetHeader>
          <SheetTitle className="font-bold border-b pb-4">Asignar permisos</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 px-4">
          {/* Info del módulo */}
          <div className="flex items-center gap-4 py-3 px-4 rounded-md border dark:bg-black/20">
            {/* Icono */}
            <div className="flex items-center justify-center w-15 h-15 shrink-0">
              {moduleIcon ? (
                <img
                  src={`${apiBackend}/${moduleIcon}?t=${Date.now()}`}
                  alt={moduleName}
                  className="w-15 h-15 object-contain brightness-0 dark:invert"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                <MdOutlineViewModule className="w-8 h-8 text-primary/70" />
              )}
            </div>
            {/* Nombre y ruta */}
            <div className="flex flex-col min-w-0">
              <span className="text-xl font-semibold truncate">{moduleName}</span>
              {modulePath && (
                <code className="text-sm text-muted-foreground truncate">{modulePath}</code>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold">Seleccione los permisos:</p>
              {isLoadingData ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <p className="text-xs text-muted-foreground text-center">Cargando permisos...</p>
                </div>
              ) : errorPermissions ? (
                <p className="text-destructive-base">{errorPermissions}</p>
              ) : (
                <div className="flex flex-col gap-2"> 
                  {/* Usé flex-col para lista vertical, o flex-wrap para 'chips' */}
                  {permissions.map((perm) => {
                    const isSelected = selectedPermissions.includes(perm.id);
                    return (
                      <Card key={perm.id} className={`p-0 m-0 rounded-md border transition-colors ${isSelected ? 'bg-primary/5 border-primary/30' : 'bg-background'}`}>
                        <div className="flex flex-row items-center px-3 py-3 cursor-pointer">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handlePermissionChange(perm.id, checked)}
                            id={`perm-${perm.id}`}
                          />
                          <label htmlFor={`perm-${perm.id}`} className="text-sm font-normal ml-3 cursor-pointer w-full select-none">
                            {perm.name}
                          </label>
                        </div>
                      </Card>
                    );
                  })}
                  {permissions.length === 0 && (
                      <p className="text-sm text-muted-foreground">No hay permisos creados en el sistema.</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-8">
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  <IoMdCloseCircleOutline className=" size-5" />
                  Cerrar
                </Button>
              </div>
              <div>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={loading}
                >
                  <FaRegSave />
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}