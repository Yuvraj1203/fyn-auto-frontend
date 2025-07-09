import { Images } from "@/public";
import Image from "next/image";
import React from "react";
import NotificationBell from "./NotificationBell";
import ProfileTool from "./ProfileTool";

function Header() {
  return (
    <header className="py-4 px-5 xl:py-6 xl:px-8 flex items-center justify-between">
      <div className="pl-4">
        <Image src={Images.appBanner} width={150} height={27} alt="logo" />
      </div>
      <div className="flex gap-8 items-center">
        <NotificationBell />
        <ProfileTool />
      </div>
    </header>
  );
}

export default Header;
