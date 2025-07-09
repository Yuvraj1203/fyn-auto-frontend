import { Images, Gear } from "@/public";
import Image from "next/image";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { CustomImage } from "@/components/atoms";

function ProfileTool() {
  const popoverTrigger = (
    <div className="group inline-flex gap-4 items-center p-2 pr-3 bg-secondaryContainer hover:bg-secondary rounded-full cursor-pointer duration-400">
      <div className="rounded-full">
        <CustomImage
          src={Images.profile}
          width={32}
          height={32}
          alt="profile image"
          className="bg-yellow-400 rounded-full size-8"
        />
      </div>
      <span className="text-secondary group-hover:text-onSecondary">
        <Gear />
      </span>
    </div>
  );

  const content = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">Popover Content</div>
        <div className="text-tiny">This is the popover content</div>
      </div>
    </PopoverContent>
  );

  return (
    <>
      <Popover color="secondary" placement={"bottom-end"}>
        <PopoverTrigger>{popoverTrigger}</PopoverTrigger>
        {content}
      </Popover>
    </>
  );
}

export default ProfileTool;
