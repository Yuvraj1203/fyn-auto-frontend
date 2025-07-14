"use client";
import { MenuSvg } from "@/public";
import React from "react";
import NotificationBell from "./NotificationBell";
import ProfileTool from "./ProfileTool";
import { useSidebarStateStore } from "@/store";
import { Timeline } from "@/components/common";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const sidebarStore = useSidebarStateStore();

  const handleSidebarClick = () => {
    sidebarStore.setSidebarSate(!sidebarStore.sidebarState);
  };

  return (
    <header className="py-4 px-1 xl:py-6 xl:px-8 flex items-center justify-between md:justify-end gap-8">
      <span
        data-sidebarexception="true"
        onClick={handleSidebarClick}
        className="inline-flex items-center justify-center text-primary cursor-pointer duration-400 md:hidden size-8 "
      >
        <MenuSvg />
      </span>
      {pathname.includes("tenant-creation") && <Timeline />}
      <div className="flex items-center gap-8">
        <NotificationBell />
        {/* <ProfileTool /> */}
      </div>
    </header>
  );
}

export default Header;
