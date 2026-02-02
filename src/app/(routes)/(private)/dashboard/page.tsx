import { Dashboard } from "@/components/pages";
import { Parent } from "@/components/templates";

const DashboardPage = () => {
  return (
    <Parent>
      <h2 className="heading2 p-5">Tenant</h2>
      <hr className="" />
      <Dashboard />
    </Parent>
  );
};

export default DashboardPage;
