import TenantList from "@/components/pages/tenant_list/tenant_list";
import { Parent } from "@/components/templates";
const TenantListPage = () => {
  return (
    <Parent>
      <h2 className="heading2 p-5">Tenant Creation</h2>
      <hr className="" />
      <TenantList />
    </Parent>
  );
};

export default TenantListPage;
