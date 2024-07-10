import { TabPanels, TabPanel } from "@chakra-ui/react";
import UserInfoTable from "./UserInfoTable";
import AdminProductTable from "./AdminProductTable";
import AdminReportTable from "./AdminReportTable";

const AdminTabPanels = ({ selectedMenu, users, admins, reports, products }) => {
  if (selectedMenu === '사용자 조회') {
    return (
      <TabPanels>
        <TabPanel>
          <UserInfoTable users={users} />
        </TabPanel>
        <TabPanel>
          <UserInfoTable users={admins} />
        </TabPanel>
      </TabPanels>
    );
  } else if (selectedMenu === '상품 관리') {
    return (
      <TabPanels>
          <TabPanel>
            <AdminProductTable products={products} />
          </TabPanel>
      </TabPanels>
    );
  } else if (selectedMenu === '신고 내역') {
    return (
      <TabPanels>
        <TabPanel>
          <AdminReportTable reports={reports} />
        </TabPanel>
      </TabPanels>
    );
  }
};

export default AdminTabPanels;