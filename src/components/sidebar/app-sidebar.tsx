import * as React from "react";
import {
  Bot,
  ChartScatter,
  CircleDollarSign,
  Fingerprint,
  Gamepad2,
  Smartphone,
} from "lucide-react";

import TAPSLogo from "@/assets/taps-toolkit-logo.svg?react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navHeader: {
    name: "TAPS Toolkit",
    logo: TAPSLogo,
    plan: "Enterprise",
  },

  navMain: [
    {
      title: "Identity",
      url: "#",
      icon: Fingerprint,
      items: [
        {
          title: "List",
          url: "/identity/list",
        },
        {
          title: "Import",
          url: "/identity/import",
        },
      ],
    },
    {
      title: "Devices",
      url: "#",
      icon: Smartphone,
      items: [
        {
          title: "List",
          url: "/device/list",
        },
        {
          title: "Import",
          url: "/device/import",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Dashboard",
          url: "/models",
        },
        {
          title: "Genesis",
          url: "/models/genesis",
        },
        {
          title: "Apollo",
          url: "/models/apollo",
        },
        {
          title: "Voyager",
          url: "/models/voyager",
        },
      ],
    },
    {
      title: "Game Jobs",
      url: "#",
      icon: Gamepad2,
      items: [
        {
          title: "Dashboard",
          url: "/jobs",
        },
        {
          title: "Create Job",
          url: "/jobs/create",
        },
        {
          title: "Job History",
          url: "/jobs/history",
        },
      ],
    },
    {
      title: "Cash Out",
      url: "#",
      icon: CircleDollarSign,
      items: [
        {
          title: "Dashboard",
          url: "/cash-out",
        },
        {
          title: "Create Cash Out",
          url: "/cash-out/create",
        },
        {
          title: "Cash Out History",
          url: "/cash-out/history",
        },
      ],
    },
    {
      title: "Statistics",
      url: "#",
      icon: ChartScatter,
      items: [
        {
          title: "Analytics",
          url: "#",
        },
        {
          title: "Reports",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader data={data.navHeader} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
