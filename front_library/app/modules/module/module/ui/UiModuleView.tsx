// react
import { useEffect, useState } from "react";

// componentes ui
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// iconos
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FolderOpen } from "lucide-react";
import { MdOutlineViewModule } from "react-icons/md";

// hook
import { useModuleView } from "../hooks/useModuleView";

// tipado
import { ModuleList } from "../type/typeModuleList";

// constantes
import { apiBackend } from "@/config/constants";

type Props = {
  id: number | null;
  modules: ModuleList[];
  loadingModules: boolean;
  errorModules: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UiModuleView(
  { id,
    modules,
    loadingModules,
    errorModules,
    open,
    onOpenChange,
  }: Props) {
  const { module, fetchModule, loading: loadingModule } = useModuleView();
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  const tree = buildTree(modules);

  useEffect(() => {
    if (open && id) {
      fetchModule(id);
    }
  }, [open, id]);

  useEffect(() => {
    if (module.icon) {
      setIconUrl(`${apiBackend}/${module.icon}?t=${Date.now()}`);
    } else {
      setIconUrl(null);
    }
  }, [module.icon]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l">
        <SheetHeader>
          <SheetTitle className="font-bold border-b pb-4">Visualizar Módulo</SheetTitle>
        </SheetHeader>
        {loadingModule || loadingModules ? (
          <div className="flex items-center justify-center h-64">
            <div>Cargando...</div>
          </div>
        ) : (
          <div className="space-y-6 px-4">
            {/* Nombre */}
            <div>
              <label className="text-sm leading-none font-medium">Nombre</label>
              <div className="mt-2 py-2 px-3 dark:bg-black/20 rounded-md border">
                <div>{module.name}</div>
              </div>
            </div>

            {/* Es módulo padre */}
            <div className="flex items-center gap-3 p-3 dark:bg-black/20 rounded-md border">
              <Checkbox checked={module.is_parent} disabled />
              <label className="text-sm">
                Es módulo padre
              </label>
            </div>

            {/* Ruta (solo si no es padre) */}
            {!module.is_parent && module.path && (
              <div>
                <label className="text-sm leading-none font-medium">
                  Ruta (Path)
                </label>
                <div className="mt-2 py-2 px-3 dark:bg-black/20 rounded-md border">
                  <code className="text-sm">{module.path}</code>
                </div>
              </div>
            )}

            {/* Módulo padre */}
            <div>
              <label className="text-sm leading-none font-medium">
                Módulo padre
              </label>
              {module.parent_id ? (
                <div className="mt-2 border rounded-md p-3 max-h-64 overflow-y-auto dark:bg-black/20">
                  {tree.map((node) => (
                    <RenderParentViewer
                      key={node.id}
                      node={node}
                      level={0}
                      selectedParentId={module.parent_id}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-2 py-2 px-3 dark:bg-black/20 rounded-md border">
                  <p className="text-sm italic">
                    No pertenece a ningún módulo padre
                  </p>
                </div>
              )}
            </div>

            {/* Icono */}
            <div>
              <label className="text-sm leading-none font-medium">Icono PNG</label>
              {iconUrl ? (
                <div className="mt-2 p-3 flex flex-col items-center">
                  <img
                    src={iconUrl}
                    alt="Icono del módulo"
                    className="w-50 h-50 rounded object-contain brightness-0 dark:invert"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <code className="text-xs break-all">
                    {module.icon}
                  </code>
                </div>
              ) : (
                <div className="mt-2 p-3 dark:bg-black/20 rounded-md border">
                  <p className="text-sm italic">
                    Sin icono asignado
                  </p>
                </div>
              )}
            </div>

            {/* Botón cerrar */}
            <div className="flex justify-start my-8">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                <IoMdCloseCircleOutline className="size-5" />
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

const RenderParentViewer = ({ 
  node,
  level,
  selectedParentId,
}: {
  node: any;
  level: number;
  selectedParentId: number | null;
}) => {
  const isSelected = node.id === selectedParentId;

  return (
    <div style={{ marginLeft: level * 16 }}>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded ${
          isSelected ? "bg-primary/5 border dark:bg-primary/20 dark:border-primary/40" : ""
        }`}
      >
        {node.is_parent && (
          <Checkbox checked={isSelected} disabled />
        )}
        {node.is_parent ? (
          <FolderOpen
            className={`h-4 w-4 ${
              isSelected ? "text-blue-400" : "text-blue-500"
            }`}
          />
        ) : (
          <MdOutlineViewModule className="h-4 w-4 text-primary/70" />
        )}
        <span className={isSelected ? "text-primary/90 leading-none font-medium" : ""}>
          {node.name}
        </span>
      </div>

      {/* Render hijos */}
      {node.children?.map((child: any) => (
        <RenderParentViewer
          key={child.id}
          node={child}
          level={level + 1}
          selectedParentId={selectedParentId}
        />
      ))}
    </div>
  );
};

/* ===============================
   Función para construir el árbol
   =============================== */
const buildTree = (modules: ModuleList[]) => {
  const map = new Map();
  modules.forEach((m) => map.set(m.id, { ...m, children: [] }));

  const tree: any[] = [];
  modules.forEach((m) => {
    if (m.parent_id === null) {
      tree.push(map.get(m.id));
    } else {
      const parent = map.get(m.parent_id);
      if (parent) parent.children.push(map.get(m.id));
    }
  });
  return tree;
};