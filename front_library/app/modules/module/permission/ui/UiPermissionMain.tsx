"use client";

// componentes
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// iconos
import { MdOutlineSecurity } from "react-icons/md";

// componentes
import UiPermissionList from "./UiPermissionList";
import UiPermissionCreate from "./UiPermissionCreate";

import { useState } from "react";
import { PermissionList } from "../type/typePermissionList";

type Props = {
  permissions: PermissionList[];
  loading: boolean;
  error: string | null;
  refreshPermissions: () => void;
};

export default function UiPermissionMain({ permissions, loading, error, refreshPermissions }: Props) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      await refreshPermissions();
    }
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button className="flex items-center gap-2">
            <MdOutlineSecurity className="h-4 w-4" />
            <span>Gestionar Permisos</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="overflow-y-auto border-l">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold border-b pb-4">Permisos</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 px-4">
            <UiPermissionCreate
              refreshPermissions={refreshPermissions}
            />
            <UiPermissionList
              permissions={permissions}
              loading={loading}
              error={error}
              refreshPermissions={refreshPermissions}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}