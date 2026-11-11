"use client"

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { SidebarModule } from "../typeSystemData"
import { apiBackend } from "@/config/constants"
import Link from "next/link"

function ModuleIcon({ icon, name, size = 15, is_parent }: { icon: string; name: string; size?: number, is_parent: boolean }) {
    return (
        <img
            src={`${apiBackend}/${icon}`}
            alt={name}
            width={size}
            className={`object-contain brightness-0 dark:invert ${is_parent ? 'mr-3' : 'ml-1.5'}`}
        />
    )
}

export function NavModules({ modules }: { modules: SidebarModule[] }) {
    const parents  = modules.filter((m) => m.is_parent)
    const children = modules.filter((m) => !m.is_parent)

    const orphans = children.filter(
        (m) => !m.parent_id || !parents.find((p) => p.id === m.parent_id)
    )

    return (
        <>
            {parents.map((parent) => {
                const kids = children.filter((m) => m.parent_id === parent.id)
                if (kids.length === 0) return null
                return (
                    <SidebarGroup key={parent.id}>
                        <SidebarGroupLabel>
                            <ModuleIcon icon={parent.icon} name={parent.name} size={20} is_parent={parent.is_parent} />
                            <span className="text-base">{parent.name}</span>
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {kids.map((mod) => (
                                <SidebarMenuItem key={mod.id}>
                                    <SidebarMenuButton asChild>
                                        <Link href={`/modules${mod.path}`}>
                                            <ModuleIcon icon={mod.icon} name={mod.name} size={20} is_parent={mod.is_parent} />
                                            <span>{mod.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )
            })}

            {orphans.length > 0 && (
                <SidebarGroup>
                    <SidebarMenu>
                        {orphans.map((mod) => (
                            <SidebarMenuItem key={mod.id}>
                                <SidebarMenuButton asChild>
                                    <Link href={`/modules${mod.path}`}>
                                        <ModuleIcon icon={mod.icon} name={mod.name} size={20} is_parent={mod.is_parent} />
                                        <span>{mod.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}
        </>
    )
}