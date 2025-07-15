import { TenantInfoForm, TenantSteps } from "@/components/pages";
import Dashboard from "@/components/pages/dashboard/Dashboard";
import { Parent } from "@/components/templates";

function TenantCreation() {
  return (
    <Parent>
      <h2 className="heading2 p-5">Tenant Creation</h2>
      <hr className="" />
      <TenantSteps />
    </Parent>
  );
}

export default TenantCreation;
