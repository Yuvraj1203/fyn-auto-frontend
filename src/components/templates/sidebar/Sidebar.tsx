"use client";
import { CustomImage } from "@/components/atoms";
import { Color, Dashboard, EditFull, Images } from "@/public";
import { useSidebarStateStore } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import ProfileTool from "../header/ProfileTool";
import { Logout } from "@/components/common";

type SidebarListType = {
  label: string;
  icon: any;
  href: string;
};

function Sidebar() {
  const pathname = usePathname();
  const sidebarStore = useSidebarStateStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const clickedOutside =
        sidebarRef.current && !sidebarRef.current.contains(target);
      const isException = target.closest('[data-sidebarexception="true"]');

      if (
        clickedOutside &&
        !isException &&
        useSidebarStateStore.getState().sidebarState
      ) {
        setTimeout(() => {
          sidebarStore.setSidebarSate(false);
        }, 10);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  //list for side menu
  const sidebarList = [
    {
      label: "Tenant",
      icon: <Dashboard />,
      href: "/dashboard",
    },
    {
      label: "Tenant Creation",
      icon: <EditFull />,
      href: "/dashboard/tenant-creation",
    },
    // {
    //   label: "File Config",
    //   icon: <EditFull />,
    //   href: "/file-configs",
    // },
    // {
    //   label: "Typography",
    //   icon: <Typography />,
    //   href: "/typography",
    // },
    // {
    //   label: "Color",
    //   icon: <Color />,
    //   href: "/color-theming",
    // },
  ];

  const renderSiderbarItem = (item: SidebarListType, index: number) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={index}
        href={item.href}
        onClick={() => sidebarStore.setSidebarSate(false)}
        className={`${
          isActive
            ? "bg-primaryContainer text-primary py-4"
            : "bg-background text-textColor hover:py-4"
        } flex items-center gap-4 subTitle font-medium py-2.5 px-4 hover:bg-primaryContainer  hover:text-primary rounded-2xl cursor-pointer duration-400`}
      >
        <span>{item.icon}</span>
        <span className="text-nowrap">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`flex flex-col gap-5 max-md:absolute max-md:z-50 h-lvh max-md:px-4 max-md:shadow-fullShadow max-md:bg-background pb-10 ${
        sidebarStore.sidebarState
          ? "max-md:translate-x-[-20px]"
          : "max-md:translate-x-[-120%]"
      } duration-400`}
      ref={sidebarRef}
    >
      <div className="py-4 xl:py-6 px-4">
        <CustomImage
          src={Images.appBanner}
          width={150}
          height={27}
          alt="logo"
          className="my-2.5"
        />
      </div>
      <nav className="flex flex-col gap-2 mb-4 grow">
        {sidebarList.map((item, index) => renderSiderbarItem(item, index))}
      </nav>
      <ProfileTool />
      <Logout />
    </aside>
  );
}

export default Sidebar;
