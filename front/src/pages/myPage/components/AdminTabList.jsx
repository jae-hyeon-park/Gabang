import { Tab, TabList } from '@chakra-ui/react';

const AdminTabList = ({ selectedMenu, onAdminTabClick, onAllUserTabClick }) => {
  if (selectedMenu === '사용자 조회') {
    return (
      <TabList>
        <Tab width='120px' height='60px' _active={{ bg: "inherit" }} onClick={onAllUserTabClick}>전체</Tab>
        <Tab width='120px' height='60px' _active={{ bg: "inherit" }} onClick={onAdminTabClick}>관리자</Tab>
      </TabList>
    );
  } else if (selectedMenu === '상품 관리') {
      return (
        <TabList>
          <Tab width='120px' height='60px' _active={{ bg: "inherit" }}>전체</Tab>
        </TabList>
      );
  } else if (selectedMenu === '신고 내역') {
    return (
      <TabList>
        <Tab width='120px' height='60px' _active={{ bg: "inherit" }}>전체</Tab>
      </TabList>
    );
  }
}

export default AdminTabList;