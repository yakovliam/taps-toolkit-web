import * as React from "react";
import {
  Bot,
  ChartScatter,
  CircleDollarSign,
  Fingerprint,
  Gamepad2,
  Map,
  Smartphone,
} from "lucide-react";

import TAPSLogo from "@/assets/taps-toolkit-logo.svg?react";

import NavMain from "./nav-main";
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
      id: "identity",
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
      id: "devices",
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
      id: "models",
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
      id: "jobs",
      items: [
        {
          title: "List",
          url: "/job/list",
        },
        {
          title: "Create Job",
          url: "/job/create",
        },
        {
          title: "Job History",
          url: "/job/history",
        },
      ],
    },
    {
      title: "Cash Out",
      url: "#",
      icon: CircleDollarSign,
      id: "cash-out",
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
      id: "statistics",
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
    {
      title: "Map",
      url: "/map",
      icon: Map,
      id: "map",
      items: [
        {
          title: "All Devices",
          url: "/map/all-devices",
        },
      ],
    },
  ],
};

export type OnOpenChange = (id: string, open: boolean) => void;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader data={data.navHeader} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onOpenChange={() => {}} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
