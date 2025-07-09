import { Bell } from "@/public";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

function NotificationBell() {
  const popoverTrigger = (
    <span className="p-2 inline-block bg-primaryContainer hover:bg-primary text-primary hover:text-primaryContainer rounded-lg cursor-pointer duration-400">
      <Bell />
    </span>
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
    <Popover>
      <PopoverTrigger>{popoverTrigger}</PopoverTrigger>
      {content}
    </Popover>
  );
}

export default NotificationBell;
