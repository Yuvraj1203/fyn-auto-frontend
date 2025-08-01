import { Header, Sidebar } from "@/components/templates";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const layout = ({ children }: LayoutProps) => {
  return (
    <main className="flex gap-5 px-5 xl:px-8 ">
      <Sidebar />
      <div className="grow">
        <Header />
        <div className="flex flex-col grow p-5 bg-surface rounded-2xl">
          {children}
        </div>
      </div>
    </main>
  );
};

export default layout;
