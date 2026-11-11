// componentes ui
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// iconos
import { FaRegSave } from "react-icons/fa";

// hook 
import { usePermissionCreate } from "../hooks/usePermissionCreate";

type Props = {
    refreshPermissions: () => void;
};

export default function UiPermissionCreate({ refreshPermissions }: Props) {
    const { formPermission, createPermission, loading } = usePermissionCreate(refreshPermissions);
    
    return (
        <div className="space-y-4">
            <h3 className="font-medium">Registrar Permiso</h3>
            <Form {...formPermission}>
                <form onSubmit={formPermission.handleSubmit(createPermission)} className="space-y-8">
                    <FormField
                        control={formPermission.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-end gap-2">
                                    <FormControl>
                                        <Input autoComplete="off" {...field} />
                                    </FormControl>
                                    <Button type="submit" className="mr-2" disabled={loading}>
                                        <FaRegSave />
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}