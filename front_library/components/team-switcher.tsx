"use client"

import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BookOpen } from "lucide-react"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 pt-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <BookOpen className="size-4" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate text-sm font-semibold tracking-[0.14em]">SIBI</span>
            <span className="truncate text-xs text-sidebar-foreground/65">Biblioteca universitaria · UNSM</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
