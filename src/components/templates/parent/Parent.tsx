import React, { ReactNode } from "react";

const Parent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col h-[calc(80vh-20px)] overflow-auto grow bg-background rounded-2xl customScrollbar">
        {children}
      </div>
    </>
  );
};

export default Parent;
