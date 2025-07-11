import { DashHeader, Dashboard } from "@/components/pages";
import { Parent } from "@/components/templates";

export default function page() {
  return (
    <Parent>
      <DashHeader />
      <hr className="" />
      <Dashboard />
    </Parent>
  );
}
