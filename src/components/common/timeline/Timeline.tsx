import { TickCircle } from "@/public";
import { TenantStatusEnum } from "@/services/models/getTenantIdByNameModel/getTenantIdByNameModel";
import React from "react";

const Timeline = () => {
  const timelineData = [
    {
      id: 1,
      label: "Tenant Info",
      status: TenantStatusEnum.completed,
    },
    {
      id: 2,
      label: "File Configs",
      status: TenantStatusEnum.ongoing,
    },
    {
      id: 3,
      label: "Theme",
      status: TenantStatusEnum.pending,
    },
    {
      id: 4,
      label: "Font Embeding",
      status: TenantStatusEnum.pending,
    },
    {
      id: 5,
      label: "Icon Generator",
      status: TenantStatusEnum.pending,
    },
  ];
  return (
    <div className="flex items-center grow gap-2 md:gap-4">
      {timelineData.map((item, index) => {
        return (
          <>
            <div className="flex justify-center items-center gap-1">
              {item.status == TenantStatusEnum.completed ? (
                <span className="size-5 rounded-full text-xs inline-grid place-content-center font-semibold text-success">
                  <TickCircle />
                </span>
              ) : (
                <span
                  className={`${
                    item.status == TenantStatusEnum.ongoing
                      ? "border-primary text-primary"
                      : "border-surface "
                  } size-5 rounded-full text-xs border-2 inline-grid place-content-center font-semibold text-outline`}
                >
                  {item.id}
                </span>
              )}
              {item.status == TenantStatusEnum.ongoing && (
                <span className="text-primary heading4">{item.label}</span>
              )}
            </div>
            {index < timelineData.length - 1 && (
              <span
                className={`grow h-1 rounded-full max-md:hidden duration-400 ${
                  item.status == TenantStatusEnum.completed
                    ? " bg-success "
                    : "bg-surface"
                }`}
              ></span>
            )}
          </>
        );
      })}
    </div>
  );
};

export default Timeline;
