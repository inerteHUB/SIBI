"use client";

import * as React from "react";
import { NavModules } from "@/app/auth/sidebar/nav-module";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarModule } from "../typeSystemData";

type Props = React.ComponentProps<typeof Sidebar> & {
    modules: SidebarModule[];
};

export function AppSidebar({ modules, ...props }: Props) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavModules modules={modules} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
