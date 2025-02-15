"use client"

import * as React from "react"
import {
  Calendar,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"



const roleBasedNavigation = {
  admin: [
    {
      title: "Admin Dashboard",
      url: "/dashboard/admin",
      icon: PieChart,
    },
    {
      title: "Members",
      url: "/dashboard/admin/management",
      icon: Bot,
      items: [
        { title: "Users", url: "/dashboard/admin/management" },
        { title: "Staff", url: "/dashboard/admin/staff" },
        { title: "Customers", url: "/dashboard/admin/customers" },
        { title: "Add User", url: "/dashboard/admin/add-user" }
      ]
    }
  ],
  sales: [
    {
      title: "Sales Dashboard",
      url: "/dashboard/sales",
      icon: PieChart,
      items: []
    },
    {
      title: "Leads",
      url: "#",
      icon: Map,
      items: [
        { title: "New Leads", url: "#" },
        { title: "Pipeline", url: "#" }
      ]
    }
  ],
  optometrist: [
    {
      title: "Exams",
      url: "/dashboard/optometrist",
      icon: BookOpen,
      items: [
        { title: "Schedule", url: "#" },
        { title: "History", url: "#" }
      ]
    }
  ],
  customer: [
    {
      title: "My Appointments",
      url: "/dashboard/customer",
      icon: Calendar,
      items: []
    }
  ]
};
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    {
      name: "SomeBussines",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Members",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ role, ...props }: {role:string} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={roleBasedNavigation[role as keyof typeof roleBasedNavigation] || []} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
