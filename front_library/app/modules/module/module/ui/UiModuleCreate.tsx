// react
import { useEffect, useState } from "react";

// constantes
import { apiBackend } from "@/config/constants";

// componentes ui
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

// iconos
import { FaRegSave } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FolderOpen } from "lucide-react";
import { MdOutlineViewModule } from "react-icons/md";

// hook
import { useModuleCreate } from "../hooks/useModuleCreate";

// tipado
import { ModuleList } from "../type/typeModuleList";

const ModuleIcon = ({ node }: { node: any }) => {
  if (node.icon) {
    return (
      <img
        src={`${apiBackend}/${node.icon}?t=${Date.now()}`}
        alt={node.name}
        className="h-5 w-5 object-contain brightness-0 dark:invert transition-all"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  if (node.is_parent) {
    return <FolderOpen className="h-5 w-5 text-blue-500" />;
  }

  return <MdOutlineViewModule className="h-5 w-5 text-slate-500 dark:text-primary/70" />;
};

type Props = {
  modules: ModuleList[];
  loadingModules: boolean;
  errorModules: string | null;
  refreshModules: () => void;
};

export default function UiModuleCreate(
  {
    modules,
    loadingModules,
    errorModules,
    refreshModules,
  }: Props) {
  
  const { formModule, createModule, loading, resetPreviewSignal } = useModuleCreate(refreshModules);
  const [open, setOpen] = useState(false);
  const is_parent = formModule.watch("is_parent");
  const [preview, setPreview] = useState<string | null>(null);

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      formModule.reset();
      await refreshModules();
      setPreview(null);
    }
  };

  const tree = buildTree(modules);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    formModule.setValue("icon", file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result ? String(reader.result) : null);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setPreview(null);
  }, [resetPreviewSignal]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2" variant="gradientStandard">
          Registrar Módulo
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto border-l">
        <SheetHeader>
          <SheetTitle className="font-bold border-b pb-4">Registrar Módulo</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 px-4">
          <Form {...formModule}>
            <form onSubmit={formModule.handleSubmit(createModule)} className="space-y-4 mb-6">
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
              <FormField
                control={formModule.control}
                name="is_parent"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 pt-2">
                    <Checkbox
                      id="is_parent_checkbox"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel htmlFor="is_parent_checkbox" className="cursor-pointer">Es módulo padre</FormLabel>
                  </FormItem>
                )}
              />
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
              <FormItem>
                <FormLabel>Seleccionar módulo padre (opcional)</FormLabel>
                <div className="border rounded-md p-2 max-h-64 overflow-y-auto dark:bg-black/20">
                  {tree.map((node) => (
                    <RenderParentSelector
                      key={node.id}
                      node={node}
                      level={0}
                      form={formModule}
                    />
                  ))}
                </div>
              </FormItem>
              <FormItem className="mt-4 flex flex-col items-center">
                <FormLabel>Icono PNG (opcional)</FormLabel>
                <Input type="file" accept="image/png" onChange={handleImageChange} />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-50 h-50 mt-2 rounded object-contain brightness-0 dark:invert"
                  />
                )}
              </FormItem>
              <div className="flex justify-between items-center mt-8">
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setOpen(false)}
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
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const RenderParentSelector = (
  {node, level, form}:
  {node: any; level: number; form: any;}
) => {
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
      <div className={`flex items-center gap-2 py-1`} style={{ paddingLeft: level * 20 }}>
        {/* Checkbox solo para padres */}
        {node.is_parent && (
          <Checkbox 
            id={`create-parent-${node.id}`}
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
          htmlFor={`create-parent-${node.id}`}
          className={`text-sm font-medium text-slate-700 dark:text-slate-200 ${node.is_parent ? "cursor-pointer hover:text-primary transition-colors": ""}`}
        >
          {node.name}
        </label>
      </div>
      {/* Render hijos */}
      {node.children && node.children.map((child: any) => (
        <RenderParentSelector key={child.id} node={child} level={level + 1} form={form} />
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