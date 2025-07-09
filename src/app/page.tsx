import Dashboard from "@/components/pages/dashboard/Dashboard";
import { Parent } from "@/components/templates";

export default function page() {
  return (
    <Parent>
      <h2 className="heading2 p-5">Tenant</h2>
      <hr className="" />
      <Dashboard />
    </Parent>
  );
}
