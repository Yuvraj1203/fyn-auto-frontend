"use client";
import { Color, Dashboard, EditFull, Typography } from "@/public";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SidebarListType = {
  label: string;
  icon: any;
  href: string;
};

function Sidebar() {
  const pathname = usePathname();
  //list for side menu
  const sidebarList = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      href: "/",
    },
    {
      label: "Tenant Creation",
      icon: <EditFull />,
      href: "/tenant-info",
    },
    {
      label: "File Config",
      icon: <EditFull />,
      href: "/file-configs",
    },
    {
      label: "Typography",
      icon: <Typography />,
      href: "/typography",
    },
    {
      label: "Color",
      icon: <Color />,
      href: "/color-theming",
    },
  ];

  const renderSiderbarItem = (item: SidebarListType, index: number) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={index}
        href={item.href}
        className={`${
          isActive
            ? "bg-primaryContainer text-primary py-4"
            : "bg-background text-textColor hover:py-4"
        } flex items-center gap-4 subTitle font-medium py-2.5 px-4 hover:bg-primaryContainer  hover:text-primary rounded-2xl cursor-pointer duration-400`}
      >
        <span>{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-2 min-w-48 w-1/5">
      {sidebarList.map((item, index) => renderSiderbarItem(item, index))}
    </nav>
  );
}

export default Sidebar;
