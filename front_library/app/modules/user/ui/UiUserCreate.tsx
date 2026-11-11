"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FaRegSave } from "react-icons/fa";
import { IoIosAddCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { useUserCreate } from "../hooks/useUserCreate";
import { UserForm } from "../type/typeUserForm";
import { useDependencyByFaculty } from "../../dependency/hooks/useDependencyByFaculty";

type Props = {
    refreshUsers: () => void;
    formData: UserForm;
    fetchFormData: () => Promise<void>;
};

const JURADO_NAMES = ["Jurado (Pre)", "Jurado (Pos)"];

export default function UiUserCreate({ refreshUsers, formData, fetchFormData }: Props) {
    const { formUser, createUser, loading } = useUserCreate(refreshUsers, formData);
    const [open, setOpen] = useState(false);
    const avatarRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const watchedRoleIds   = formUser.watch("role_ids");
    const watchedSpecs = formUser.watch("specialization_ids");
    const watchedFacultyId = formUser.watch("faculty_id");
    const { dependenciesByFaculty, refreshDependenciesByFaculty, clearDependencies } = useDependencyByFaculty();
    const isAutor = watchedRoleIds.some((id) => {
        const role = formData.roles.find((r) => r.id === id);
        return role && formData.autor_role_names.includes(role.name);
    });
    const isJurado = formData.roles
        .filter((r) => watchedRoleIds.includes(r.id))
        .some((r) => JURADO_NAMES.includes(r.name));

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        formUser.setValue("avatar", file, { shouldValidate: true });
        setAvatarPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleRemoveAvatar = () => {
        formUser.setValue("avatar", null);
        setAvatarPreview(null);
        if (avatarRef.current) avatarRef.current.value = "";
    };

    const toggleRole = (id: number, checked: boolean) => {
        const current = formUser.getValues("role_ids");
        const updated = checked ? [...current, id] : current.filter((r) => r !== id);
        formUser.setValue("role_ids", updated, { shouldValidate: true });
        const stillJurado = formData.roles.filter((r) => updated.includes(r.id)).some((r) => JURADO_NAMES.includes(r.name));
        if (!stillJurado) formUser.setValue("specialization_ids", []);
    };

    const toggleSpec = (id: number, checked: boolean) => {
        const current = formUser.getValues("specialization_ids");
        const updated = checked ? [...current, id] : current.filter((s) => s !== id);
        formUser.setValue("specialization_ids", updated, { shouldValidate: true });
    };

    const handleOpenChange = async (isOpen: boolean) => {
        if (isOpen) {
            await fetchFormData();
        } else {
            formUser.reset();
            setAvatarPreview(null);
            if (avatarRef.current) avatarRef.current.value = "";
        }
        setOpen(isOpen);
    };

    useEffect(() => {
        formUser.setValue("dependency_id", null);
        if (isAutor && watchedFacultyId > 0) {
            refreshDependenciesByFaculty(watchedFacultyId);
        } else {
            clearDependencies();
        }
    }, [watchedFacultyId, isAutor]);

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2">
                    <IoIosAddCircle className="h-4 w-4" /> Registrar
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto border-l">
                <SheetHeader>
                    <SheetTitle className="text-lg font-bold border-b pb-4">Registrar Usuario</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-4">
                    <Form {...formUser}>
                        <form onSubmit={formUser.handleSubmit(createUser)} className="space-y-4">
                            {/* Avatar */}
                            <FormField control={formUser.control} name="avatar" render={() => (
                                <FormItem>
                                    <FormLabel>Foto de perfil</FormLabel>
                                    <FormControl>
                                        <div>
                                            <div className="flex justify-center mb-3">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Avatar" className="h-24 w-24 rounded-full border object-cover" />
                                                ) : (
                                                    <div className="flex h-24 w-24 items-center justify-center rounded-full border bg-muted text-xs text-muted-foreground">Sin foto</div>
                                                )}
                                            </div>
                                            <div className="flex justify-center gap-3">
                                                <Button type="button" variant="outline" onClick={() => avatarRef.current?.click()}>
                                                    Seleccionar foto
                                                </Button>
                                                {avatarPreview && (
                                                    <Button type="button" variant="outlineDestructive" onClick={handleRemoveAvatar}>Quitar</Button>
                                                )}
                                                <input ref={avatarRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Facultad */}
                            <FormField control={formUser.control} name="faculty_id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facultad <span className="text-destructive-base">*</span></FormLabel>
                                    <Select
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        value={field.value > 0 ? String(field.value) : ""}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger><SelectValue placeholder="Seleccionar facultad" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {formData.faculties.map((f) => (
                                                <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Nombre y apellidos */}
                            <div className="grid grid-cols-2 gap-3">
                                <FormField control={formUser.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre <span className="text-destructive-base">*</span></FormLabel>
                                        <FormControl><Input autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={formUser.control} name="last_name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Segundo Nombre</FormLabel>
                                        <FormControl><Input autoComplete="off" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField control={formUser.control} name="paternal_surname" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ap. Paterno <span className="text-destructive-base">*</span></FormLabel>
                                        <FormControl><Input autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={formUser.control} name="maternal_surname" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ap. Materno <span className="text-destructive-base">*</span></FormLabel>
                                        <FormControl><Input autoComplete="off" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Usuario y contraseña */}
                            <FormField control={formUser.control} name="username" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usuario <span className="text-destructive-base">*</span></FormLabel>
                                    <FormControl><Input autoComplete="off" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={formUser.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña <span className="text-destructive-base">*</span></FormLabel>
                                    <FormControl><Input type="password" autoComplete="new-password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* DNI, email, teléfono */}
                            <FormField control={formUser.control} name="dni" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>DNI <span className="text-destructive-base">*</span></FormLabel>
                                    <FormControl><Input autoComplete="off" maxLength={8} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={formUser.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email <span className="text-destructive-base">*</span></FormLabel>
                                    <FormControl><Input autoComplete="off" type="email" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={formUser.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono <span className="text-destructive-base">*</span></FormLabel>
                                    <FormControl><Input autoComplete="off" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Género y fecha */}
                            <div className="grid grid-cols-2 gap-3">
                                <FormField control={formUser.control} name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Género <span className="text-destructive-base">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Género" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="M">Masculino</SelectItem>
                                                <SelectItem value="F">Femenino</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={formUser.control} name="birthdate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Nacimiento</FormLabel>
                                        <FormControl><Input type="date" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Dirección */}
                            <FormField control={formUser.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl><Input autoComplete="off" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value || null)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Roles */}
                            <FormField control={formUser.control} name="role_ids" render={() => (
                                <FormItem>
                                    <FormLabel>Roles <span className="text-destructive-base">*</span></FormLabel>
                                    <div className="space-y-2 rounded border p-3">
                                        {formData.roles.map((role) => (
                                            <div key={role.id} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={watchedRoleIds.includes(role.id)}
                                                    onCheckedChange={(c) => toggleRole(role.id, !!c)}
                                                />
                                                <label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer">{role.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {isJurado && (
                                <FormField control={formUser.control} name="specialization_ids" render={() => (
                                    <FormItem>
                                        <FormLabel>Especializaciones</FormLabel>
                                        <div className="space-y-2 rounded border p-3">
                                            {formData.specializations.map((spec) => (
                                                <div key={spec.id} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`spec-${spec.id}`}
                                                        checked={watchedSpecs.includes(spec.id)}
                                                        onCheckedChange={(c) => toggleSpec(spec.id, !!c)}
                                                    />
                                                    <label htmlFor={`spec-${spec.id}`} className="text-sm cursor-pointer">{spec.name}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}

                            {isAutor && (
                                <FormField
                                    control={formUser.control}
                                    name="dependency_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Escuela / Dependencia</FormLabel>
                                            <Select
                                                disabled={!watchedFacultyId || watchedFacultyId === 0}
                                                onValueChange={(v) => field.onChange(v === "none" ? null : Number(v))}
                                                value={field.value ? String(field.value) : "none"}
                                            >
                                                <FormControl className="w-full">
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                !watchedFacultyId || watchedFacultyId === 0
                                                                    ? "Selecciona primero una facultad"
                                                                    : "Selecciona escuela"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">— Sin escuela —</SelectItem>
                                                    {dependenciesByFaculty.map((d) => (
                                                        <SelectItem key={d.id} value={String(d.id)}>
                                                            {d.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="flex justify-between items-center mt-8">
                                <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
                                    <IoMdCloseCircleOutline className="size-5" /> Cerrar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    <FaRegSave /> {loading ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}