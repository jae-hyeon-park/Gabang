import { Tab, TabList } from '@chakra-ui/react';

const UserTabList = ({ selectedMenu, handleSalesTabClick, handlePurchaseTabClick }) => {
  if (selectedMenu === '판매 내역') {
    return (
      <TabList>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg"
          onClick={() => handleSalesTabClick()}>
          전체
        </Tab>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg"
          onClick={() => handleSalesTabClick('1')}>
          판매중
        </Tab>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg"
          onClick={() => handleSalesTabClick('2')}>
          예약중
        </Tab>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg"
          onClick={() => handleSalesTabClick('3')}>
          판매완료
        </Tab>
      </TabList>
    );
  } else if (selectedMenu === '구매 내역') {
    return (
      <TabList>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg"
          onClick={() => handlePurchaseTabClick('all')}>
          전체
        </Tab>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg"
          onClick={() => handlePurchaseTabClick('before')}>
          구매확정 전
        </Tab>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg"
          onClick={() => handlePurchaseTabClick('after')}>
          구매확정 후
        </Tab>
      </TabList>
    );
  } else if (selectedMenu === '신고 내역') {
    return (
      <TabList>
        <Tab
          _selected={{ color: 'color.blue', borderColor: 'color.blue' }}
          width="120px"
          height="60px"
          _active={{ bg: 'inherit' }}
          fontSize="lg">
          전체
        </Tab>
      </TabList>
    );
  }
};

export default UserTabList;
