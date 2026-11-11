"use client";

import { useState } from "react";
import { apiBackend } from "@/config/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingText } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye, FaKey } from "react-icons/fa";
import { Trash2 } from "lucide-react";

import UiUserCreate         from "./UiUserCreate";
import UiUserView           from "./UiUserView";
import UiUserEdit           from "./UiUserEdit";
import UiUserDelete         from "./UiUserDelete";
import UiUserEnable         from "./UiUserEnable";
import UiUserDisable        from "./UiUserDisable";
import UiUserChangePassword from "./UiUserChangePassword";

import { UserList } from "../type/typeUserList";
import { UserForm } from "../type/typeUserForm";
import { useUserView } from "../hooks/useUserView";

type Props = {
    Users: UserList[];
    loadingUsers: boolean;
    errorUsers: string | null;
    refreshUsers: () => void;
    formData: UserForm;
    fetchFormData: () => Promise<void>;
};

const badgeVariantMap: Record<string, "default" | "warning" | "destructive"> = {
    Activo: "default", Deshabilitado: "warning", Eliminado: "destructive",
};

export default function UiUserList({Users, loadingUsers, errorUsers, refreshUsers, formData, fetchFormData}: Props) {
    const [selectedId,   setSelectedId]   = useState<number | null>(null);
    const [openView,     setOpenView]     = useState(false);
    const [openEdit,     setOpenEdit]     = useState(false);
    const [openDelete,   setOpenDelete]   = useState(false);
    const [openEnable,   setOpenEnable]   = useState(false);
    const [openDisable,  setOpenDisable]  = useState(false);
    const [openPassword, setOpenPassword] = useState(false);

    const { user: userDetail, fetchUser, loading: loadingView } = useUserView();
    const selected = Users.find((u) => u.id === selectedId) ?? null;

    const isActivo        = selected?.state === "Activo";
    const isDeshabilitado = selected?.state === "Deshabilitado";

    const handleRowClick = (id: number) => setSelectedId((prev) => (prev === id ? null : id));

    const handleView = async () => {
        if (!selectedId) return;
        await Promise.all([fetchUser(selectedId), fetchFormData()]);
        setOpenView(true);
    };

    const handleEdit = async () => {
        if (!selected) return;
        await fetchFormData();
        setOpenEdit(true);
    };

    const handlePassword = () => {
        if (!selected) return;
        setOpenPassword(true);
    };

    const handleDelete = () => {
        if (!selected) return;
        setOpenDelete(true);
    };

    const handleEnable = () => {
        if (!selected) return;
        setOpenEnable(true);
    };

    const handleDisable = () => {
        if (!selected) return;
        setOpenDisable(true);
    };

    const getRoleName = (id: number) => formData.roles.find((r) => r.id === id)?.name ?? String(id);

    if (loadingUsers) return <LoadingText />;
    if (errorUsers)   return <p className="text-destructive">{errorUsers}</p>;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4">
                <UiUserCreate
                    refreshUsers={refreshUsers}
                    formData={formData}
                    fetchFormData={fetchFormData}
                />
                <Button variant="success" disabled={!selected} onClick={handleView}>
                    <FaEye /> Visualizar
                </Button>
                <Button variant="info" disabled={!isActivo} onClick={handleEdit}>
                    <FaEdit /> Editar
                </Button>
                <Button variant="secondary" disabled={!isActivo} onClick={handlePassword}>
                    <FaKey /> Cambiar Contraseña
                </Button>
                <Button variant="destructive" disabled={!isActivo && !isDeshabilitado} onClick={handleDelete}>
                    <Trash2 /> Eliminar
                </Button>
                <Button variant="success" disabled={!isDeshabilitado} onClick={handleEnable}>
                    <Trash2 /> Habilitar
                </Button>
                <Button variant="warning" disabled={!isActivo} onClick={handleDisable}>
                    <Trash2 /> Deshabilitar
                </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary-foreground">
                        <TableRow>
                            <TableHead className="w-[60px]">N°</TableHead>
                            <TableHead className="w-[70px] text-center">Foto</TableHead>
                            <TableHead>Nombre completo</TableHead>
                            <TableHead className="w-[100px]">Usuario</TableHead>
                            <TableHead className="w-[90px]">DNI</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead className="w-[110px]">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-10 text-center text-muted-foreground">
                                    No hay usuarios registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            Users.map((u) => (
                                <TableRow
                                    key={u.id}
                                    onClick={() => handleRowClick(u.id)}
                                    data-state={selectedId === u.id ? "selected" : undefined}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-mono">{u.id}</TableCell>
                                    <TableCell className="text-center">
                                        {u.avatar ? (
                                            <img src={`${apiBackend}/${u.avatar}`} alt="Avatar" className="mx-auto h-9 w-9 rounded-full object-cover border" />
                                        ) : (
                                            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground border">
                                                {u.name.charAt(0)}{u.paternal_surname.charAt(0)}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {u.name} {u.last_name ?? ""} {u.paternal_surname} {u.maternal_surname}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{u.username}</TableCell>
                                    <TableCell className="font-mono">{u.dni}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {u.role_ids.length === 0 ? (
                                                <Badge variant="destructive" className="text-xs">Root</Badge>
                                            ) : (
                                                u.role_ids.map((id) => (
                                                    <Badge key={id} variant="standard" className="text-xs">{getRoleName(id)}</Badge>
                                                ))
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={badgeVariantMap[u.state] ?? "secondary"} className="text-xs">
                                            {u.state}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UiUserView
                open={openView}
                onOpenChange={setOpenView}
                user={userDetail}
                loading={loadingView}
                formData={formData}
            />
            <UiUserEdit
                open={openEdit}
                onOpenChange={setOpenEdit}
                user={selected}
                refreshUsers={refreshUsers}
                formData={formData}
                fetchFormData={fetchFormData}
            />
            <UiUserChangePassword
                open={openPassword}
                onOpenChange={setOpenPassword}
                userId={selectedId}
            />
            <UiUserDelete
                open={openDelete}
                onOpenChange={setOpenDelete}
                id={selectedId}
                refreshUsers={() => { refreshUsers(); setSelectedId(null); }}
            />
            <UiUserEnable
                open={openEnable}
                onOpenChange={setOpenEnable}
                id={selectedId}
                refreshUsers={() => { refreshUsers(); setSelectedId(null); }}
            />
            <UiUserDisable
                open={openDisable}
                onOpenChange={setOpenDisable}
                id={selectedId}
                refreshUsers={() => { refreshUsers(); setSelectedId(null); }}
            />
        </div>
    );
}