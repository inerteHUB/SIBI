// react
import { useState, useMemo } from "react";

// constantes
import { apiBackend } from "@/config/constants";

// componentes ui
import { LoadingSpinner } from "@/components/loading";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// tipado
import { ModuleList } from "../type/typeModuleList";
import { PermissionList } from "../../permission/type/typePermissionList";

// iconos
import { ChevronDown, ChevronDownSquare, ChevronRight, ChevronUpSquare, Eye, FolderOpen, MoreVertical, Pencil, ShieldCheck, Trash } from "lucide-react";
import { MdOutlineViewModule } from "react-icons/md";

// componentes
import UiModuleDelete from "./UiModuleDelete";
import UiModuleAssignPermissions from "./UiModuleAssignPermissions";
import UiModuleView from "./UiModuleView";
import UiModuleEdit from "./UiModuleEdit";

type Props = {
  modules: ModuleList[];
  loadingModules: boolean;
  errorModules: string | null;
  refreshModules: () => void;
  permissions: PermissionList[];
  loadingPermissions: boolean;
  errorPermissions: string | null;
  refreshPermissions: () => void;
};

export default function UiModuleList(
  { 
    modules, 
    loadingModules, 
    errorModules, 
    refreshModules,
    permissions, 
    loadingPermissions, 
    errorPermissions, 
    refreshPermissions 
  }: Props) {

  const tree = useMemo(() => buildTree(modules), [modules]);

  // Estado para controlar la expansión global (null = individual, true = todos, false = ninguno)
  const [expandTrigger, setExpandTrigger] = useState<number>(0); 
  const [defaultExpanded, setDefaultExpanded] = useState(true);

  if (loadingModules) return <LoadingSpinner />;
  if (errorModules) return <p className="text-destructive-base">{errorModules}</p>;
  if (!modules || modules.length === 0) {
    return (
      <div className="text-muted-foreground text-base">
        No hay módulos registrados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botones de Control */}
      <div className="flex flex-wrap gap-4 mb-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setDefaultExpanded(true); setExpandTrigger(prev => prev + 1); }}
          className="text-xs flex gap-2"
        >
          <ChevronDownSquare className="h-4 w-4" /> Expandir todo
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setDefaultExpanded(false); setExpandTrigger(prev => prev + 1); }}
          className="text-xs flex gap-2"
        >
          <ChevronUpSquare className="h-4 w-4" /> Contraer todo
        </Button>
      </div>
      <div className="w-fit min-w-[300px] border rounded-lg p-4 bg-white dark:bg-black/10">
        {tree.map((node) => (
          <RenderModule 
            key={`${node.id}-${expandTrigger}`} 
            node={node} 
            level={0}
            defaultOpen={defaultExpanded}
            modules={modules}
            loadingModules={loadingModules}
            errorModules={errorModules}
            refreshModules={refreshModules} 
            permissions={permissions}
            loadingPermissions={loadingPermissions}
            errorPermissions={errorPermissions}
            refreshPermissions={refreshPermissions}
          />
        ))}
      </div>
    </div>
  );
}

const buildTree = (modules: ModuleList[]) => {
  const map = new Map<number, ModuleList & { children: any[] }>();
  
  modules.forEach((m) => {
    map.set(m.id, { ...m, children: [] });
  });

  const tree: any[] = [];

  modules.forEach((m) => {
    if (m.parent_id === null) {
      tree.push(map.get(m.id));
    } else {
      const parent = map.get(m.parent_id);
      if (parent) {
        parent.children.push(map.get(m.id));
      }
    }
  });

  return tree;
};

const RenderModule = (
  { 
    node, 
    level = 0, 
    defaultOpen = true,
    modules, 
    loadingModules, 
    errorModules, 
    refreshModules,
    permissions,
    loadingPermissions,
    errorPermissions,
    refreshPermissions
  }: { 
    node: any; 
    level?: number; 
    defaultOpen?: boolean;
    modules: ModuleList[];
    loadingModules: boolean;
    errorModules: string | null;
    refreshModules: () => void;
    permissions: PermissionList[];
    loadingPermissions: boolean;
    errorPermissions: string | null;
    refreshPermissions: () => void;
  }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPermissionsSheet, setShowPermissionsSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showViewSheet, setShowViewSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = node.children && node.children.length > 0;

  // --- LÓGICA DE ICONOS ---
  const renderIcon = () => {
    // 1. Si el módulo trae un path de imagen (PNG)
    if (node.icon) {
      return (
        <img 
          src={`${apiBackend}/${node.icon}`}
          alt={node.name}
          className="h-10 w-10 object-contain brightness-0 dark:invert"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    // 2. Si no hay icono
    if (node.is_parent) {
      return <FolderOpen className="h-10 w-10 text-blue-500" />;
    }
    return <MdOutlineViewModule className="h-10 w-10 text-primary/70" />;
  };
  
  return (
    <div>
      {/* Contenedor de la línea vertical */}
      <div className="flex items-start" style={{ marginLeft: level * 20, position: "relative" }}>
        {/* Línea vertical */}
        {level > 0 && (
          <div className="absolute -left-1 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10" />
        )}
        {/* Contenido del item */}
        <div
          className={`flex items-center gap-2 py-1 cursor-pointer select-none hover:bg-black/5 dark:hover:bg-white/5 rounded-md ${node.is_parent ? "px-2" : "pl-1 pr-2"}`}
          onClick={() => hasChildren && setOpen(!open)}
        >
          {/* Flecha de expansion */}
          <div className="h-5 w-5 flex items-center justify-center">
            {hasChildren ? (
              open ? <ChevronDown className="h-5 w-5 text-slate-800 dark:text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />
            ) : null}
          </div>
          {/* Icono */}
          <div className="flex items-center justify-center w-5 h-5">
            {renderIcon()}
          </div>
          {/* Nombre del módulo */}
          <span className="text-slate-800 dark:text-slate-200">{node.name}</span>
          {/* Dropdown Menu */}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger 
              onClick={(e) => e.stopPropagation()}
              className="focus:outline-none"
            >
              <MoreVertical className="h-5 w-5 cursor-pointer hover:text-black text-slate-600 dark:text-slate-400 dark:hover:text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {node.is_parent == false && (
                <DropdownMenuItem 
                  onSelect={() => {
                    setShowPermissionsSheet(true); 
                    setMenuOpen(false); 
                  }} 
                  className="mt-2"
                >
                  <div className="flex items-center gap-2 cursor-pointer px-2">
                    <ShieldCheck className="text-warning-base h-10 w-10" />
                    <span className="text-sm text-warning-base">Permisos</span>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onSelect={() => {
                  setShowEditSheet(true);
                  setMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2 cursor-pointer px-2">
                  <Pencil className="text-info-base h-10 w-10" />
                  <span className="text-sm text-info-base">Editar</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => {
                  setShowViewSheet(true);
                  setMenuOpen(false);
                }}
              >
                <div className="flex items-center gap-2 cursor-pointer px-2">
                  <Eye className="text-success-base h-10 w-10" />
                  <span className="text-sm text-success-base">Visualizar</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => {
                  setShowDeleteDialog(true);
                  setMenuOpen(false);
                }}
                className="mb-2"
              >
                <div className="flex items-center gap-2 cursor-pointer px-2">
                  <Trash className="text-destructive-base h-10 w-10" />
                  <span className="text-sm text-destructive-base">Eliminar</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {showPermissionsSheet && (
          <UiModuleAssignPermissions
            moduleId={node.id} 
            moduleName={node.name}
            modulePath={node.path}
            moduleIcon={node.icon}
            permissions={permissions}
            loadingPermissions={loadingPermissions}
            errorPermissions={errorPermissions}
            refreshPermissions={refreshPermissions}
            open={showPermissionsSheet}
            onOpenChange={setShowPermissionsSheet}
          />
        )}

        {showEditSheet && (
          <UiModuleEdit
            id={node.id}
            modules={modules}
            loadingModules={loadingModules}
            errorModules={errorModules}
            open={showEditSheet}
            onOpenChange={setShowEditSheet}
            refreshModules={refreshModules}
          />
        )}

        {showViewSheet && (
          <UiModuleView
            id={node.id}
            modules={modules}
            loadingModules={loadingModules}
            errorModules={errorModules}
            open={showViewSheet}
            onOpenChange={setShowViewSheet}
          />
        )}

        {showDeleteDialog && (
          <UiModuleDelete 
            id={node.id} 
            refreshModules={refreshModules} 
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          />
        )}
      </div>

      {/* Render hijos */}
      {hasChildren && open && (
        <div className="transition-all">
          {node.children.map((child: any) => (
            <RenderModule 
              key={child.id} 
              node={child} 
              level={level + 1} 
              defaultOpen={defaultOpen} 
              modules={modules}
              loadingModules={loadingModules}
              errorModules={errorModules}
              refreshModules={refreshModules} 
              permissions={permissions}
              loadingPermissions={loadingPermissions}
              errorPermissions={errorPermissions}
              refreshPermissions={refreshPermissions}            
            />
          ))}
        </div>
      )}
    </div>
  );
};