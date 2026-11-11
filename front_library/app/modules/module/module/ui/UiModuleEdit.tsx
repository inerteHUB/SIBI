// react
import { useEffect, useState } from "react";

// constantes
import { apiBackend } from "@/config/constants";

// componentes ui
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// iconos
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FolderOpen } from "lucide-react";
import { MdOutlineViewModule } from "react-icons/md";

// hooks
import { useModuleEdit } from "../hooks/useModuleEdit";
import { useModuleView } from "../hooks/useModuleView";

// tipado
import { ModuleList } from "../type/typeModuleList";

const ModuleIcon = ({ node }: { node: any }) => {
  if (node.icon) {
    return (
      <img
        src={`${apiBackend}/${node.icon}?t=${Date.now()}`}
        alt={node.name}
        className="h-5 w-5 object-contain grayscale brightness-0 dark:invert transition-all"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    );
  }
  if (node.is_parent) return <FolderOpen className="h-5 w-5 text-blue-500" />;
  return <MdOutlineViewModule className="h-5 w-5 text-slate-500 dark:text-primary/70" />;
};

type Props = {
  id: number;
  modules: ModuleList[];
  loadingModules: boolean;
  errorModules: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refreshModules: () => void;
};

export default function UiModuleEdit({
  id,
  modules,
  loadingModules,
  errorModules,
  open,
  onOpenChange,
  refreshModules,
}: Props) {
  const { module: moduleData, fetchModule, loading: loadingModule } = useModuleView();
  const { formModule, editModule, loading, resetPreviewSignal } = useModuleEdit(id, refreshModules);

  const is_parent = formModule.watch("is_parent");
  const remove_icon = formModule.watch("remove_icon");

  const [preview, setPreview] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  // Fetch del módulo al abrir
  useEffect(() => {
    if (open && id) {
      fetchModule(id);
    }
  }, [open, id]);

  // Cargar datos en el formulario cuando lleguen
  useEffect(() => {
    if (open && moduleData.id) {
      formModule.reset({
        name: moduleData.name,
        path: moduleData.path ?? "",
        is_parent: moduleData.is_parent,
        parent_id: moduleData.parent_id,
        icon: null,
        remove_icon: false,
      });
      setPreview(null);
      setIconUrl(moduleData.icon ? `${apiBackend}/${moduleData.icon}?t=${Date.now()}` : null);
    }
  }, [moduleData]);

  // Limpiar preview tras submit exitoso
  useEffect(() => {
    setPreview(null);
  }, [resetPreviewSignal]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    formModule.setValue("icon", file);
    const reader = new FileReader();
    reader.onload = () => setPreview(`${reader.result}?t=${Date.now()}`);
    reader.readAsDataURL(file);
  };

  const tree = buildTree(modules);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l">
        <SheetHeader>
          <SheetTitle className="font-bold border-b pb-4">Editar Módulo</SheetTitle>
        </SheetHeader>

        {loadingModule ? (
          <div className="flex items-center justify-center h-64">
            <p>Cargando...</p>
          </div>
        ) : (
          <div className="space-y-6 px-4">
            <Form {...formModule}>
              <form onSubmit={formModule.handleSubmit(editModule)} className="space-y-4 mb-6">
                {/* Nombre */}
                <FormField
                  control={formModule.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Es módulo padre */}
                <FormField
                  control={formModule.control}
                  name="is_parent"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="is_parent_checkbox_edit"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel htmlFor="is_parent_checkbox_edit" className="cursor-pointer">
                        Es módulo padre
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {/* Ruta */}
                {!is_parent && (
                  <FormField
                    control={formModule.control}
                    name="path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ruta (Path)</FormLabel>
                        <FormControl>
                          <Input autoComplete="off" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* Selector de módulo padre */}
                <FormItem>
                  <FormLabel>Seleccionar módulo padre (opcional)</FormLabel>
                  <div className="border rounded-md p-2 max-h-64 overflow-y-auto dark:bg-black/20">
                    {loadingModules ? (
                      <p className="text-sm text-muted-foreground p-2">Cargando...</p>
                    ) : (
                      tree.map((node) => (
                        <RenderParentSelector
                          key={node.id}
                          node={node}
                          level={0}
                          form={formModule}
                          currentId={id}
                        />
                      ))
                    )}
                  </div>
                </FormItem>
                {/* Sección icono */}
                <div className="flex flex-col items-center">
                  <label className="text-sm leading-none font-medium">Icono PNG</label>
                  {/* Icono actual */}
                  {iconUrl && (
                    <div className="mt-2 p-3">
                      <img
                        src={iconUrl}
                        alt="Icono del módulo"
                        className="w-50 h-50 rounded object-contain brightness-0 dark:invert"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        />
                    </div>
                  )}
                </div>
                {/* Switch eliminar icono */}
                {iconUrl && (
                  <FormField
                    control={formModule.control}
                    name="remove_icon"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                formModule.setValue("icon", null);
                                setPreview(null);
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer text-sm">
                          Módulo sin icono
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                )}
                {/* Input nueva imagen */}
                {!remove_icon && (
                  <FormItem className="mt-4 flex flex-col items-center">
                    <FormLabel>
                      {iconUrl
                        ? "Subir nuevo icono (reemplaza el actual):"
                        : "Subir icono (opcional):"}
                    </FormLabel>
                    <Input type="file" accept="image/png" onChange={handleImageChange} />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview nuevo icono"
                        className="w-50 h-50 mt-2 rounded object-contain brightness-0 dark:invert"
                      />
                    )}
                  </FormItem>
                )}
                {remove_icon && (
                  <p className="text-xs text-destructive-base">
                    El icono actual será eliminado al guardar.
                  </p>
                )}
                <div className="flex justify-between items-center mt-8">
                  <div>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="w-full" 
                      onClick={() => onOpenChange(false)}
                    >
                      <IoMdCloseCircleOutline className="size-5" />
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
            </Form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

const RenderParentSelector = (
  {node, level, form, currentId}: 
  {node: any; level: number; form: any; currentId: number | null;}
) => {
  if (node.id === currentId) return null;

  return (
    <div className="relative">
      {/* Línea vertical */}
      {level > 0 && (
        <div 
          className="absolute w-px bg-slate-300 dark:bg-white/10" 
          style={{ 
            left: `${(level * 20) - 12}px`, 
            top: 0, 
            bottom: 0 
          }}
        />
      )}
      <div className="flex items-center gap-2 py-1" style={{ paddingLeft: level * 20 }}>
        {/* Checkbox solo para padres */}
        {node.is_parent && (
          <Checkbox
            id={`edit-parent-${node.id}`}
            checked={form.watch("parent_id") === node.id}
            onCheckedChange={(checked) =>
              form.setValue("parent_id", checked ? node.id : null)
            }
          />
        )}
        {/* Icono */}
        <div className="flex items-center justify-center w-5 h-5">
          <ModuleIcon node={node} />
        </div>
        {/* Nombre del módulo */}
        <label
          htmlFor={`edit-parent-${node.id}`}
          className={`text-sm font-medium text-slate-700 dark:text-slate-200 ${node.is_parent ? "cursor-pointer hover:text-primary transition-colors" : ""}`}
        >
          {node.name}
        </label>
      </div>
      {node.children?.map((child: any) => (
        <RenderParentSelector key={child.id} node={child} level={level + 1} form={form} currentId={currentId} />
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