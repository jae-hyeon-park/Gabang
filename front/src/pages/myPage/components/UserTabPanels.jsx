import { TabPanels, TabPanel } from '@chakra-ui/react';
import UserItemsTable from './UserItemsTable';
import UserReportTable from './UserReportTable';

const UserTabPanels = ({ selectedMenu, salesProducts, purchasedProducts, myReports, page, setPage, userId, selectedTab, getSalesProducts, getPurchasedProduct, isLoading }) => {
  if (selectedMenu === '판매 내역') {
    return (
      <TabPanels>
        <TabPanel>
          <UserItemsTable
            products={salesProducts}
            selectedMenu={selectedMenu}
            page={page}
            setPage={setPage}
            userId={userId}
            selectedTab={selectedTab}
            getSalesProducts={getSalesProducts}
            isLoading={isLoading}
          />
        </TabPanel>
        <TabPanel>
          <UserItemsTable
            products={salesProducts}
            selectedMenu={selectedMenu}
            page={page}
            setPage={setPage}
            userId={userId}
            selectedTab={selectedTab}
            getSalesProducts={getSalesProducts}
            isLoading={isLoading}
          />
        </TabPanel>
        <TabPanel>
          <UserItemsTable
            products={salesProducts}
            selectedMenu={selectedMenu}
            page={page}
            setPage={setPage}
            userId={userId}
            selectedTab={selectedTab}
            getSalesProducts={getSalesProducts}
            isLoading={isLoading}
          />
        </TabPanel>
        <TabPanel>
          <UserItemsTable
            products={salesProducts}
            selectedMenu={selectedMenu}
            page={page}
            setPage={setPage}
            userId={userId}
            selectedTab={selectedTab}
            getSalesProducts={getSalesProducts}
            isLoading={isLoading}
          />
        </TabPanel>
      </TabPanels>
    );
  } else if (selectedMenu === '구매 내역') {
    return (
      <TabPanels>
        <TabPanel>
          <UserItemsTable
            products={purchasedProducts}
            selectedMenu={selectedMenu}
            page={page}
            userId={userId}
            selectedTab={selectedTab}
            getPurchasedProduct={getPurchasedProduct}
          />
        </TabPanel>
        <TabPanel>
          <UserItemsTable
            products={purchasedProducts}
            selectedMenu={selectedMenu}
            page={page}
            userId={userId}
            selectedTab={selectedTab}
            getPurchasedProduct={getPurchasedProduct}
          />
        </TabPanel>
        <TabPanel>
          <UserItemsTable
            products={purchasedProducts}
            selectedMenu={selectedMenu}
            page={page}
            userId={userId}
            selectedTab={selectedTab}
            getPurchasedProduct={getPurchasedProduct}
          />
        </TabPanel>
      </TabPanels>
    );
  } else if (selectedMenu === '신고 내역') {
    return (
      <TabPanels>
        <TabPanel>
          <UserReportTable reports={myReports} />
        </TabPanel>
      </TabPanels>
    );
  }
};

export default UserTabPanels;
