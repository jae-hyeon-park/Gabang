import {
  Box,
  Text,
  Tabs,
  Flex,
  useToast,
  VStack,
  HStack,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import RenderMenu from './components/RenderMenu';
import UserProfile from './components/UserProfile';
import UserTabList from './components/UserTabList';
import UserTabPanels from './components/UserTabPanels';
import Pagination from 'react-js-pagination';
import './style/pagination.css';
import { getPayload, getCookie } from '../../utils/cookie';

export const MyPage = () => {
  const [isLoading, setIsLoading] = useState(true); // 로딩중
  const menuList = ['판매 내역', '구매 내역', '신고 내역'];
  const [salesProducts, setSalesProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(menuList[0]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  const toast = useToast();

  const [formData, setFormData] = useState({
    userId: getPayload('token').userId,
    userPhoneNumber: '',
    userName: '',
    cdBankcode: '',
    userAccount: '',
    joinDate: '',
    isInsurance: false,
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    setSelectedTab(0);
    switch (selectedMenu) {
      case menuList[0]:
        setPage(1);
        getSalesProducts(page, formData.userId);
        break;
      case menuList[1]:
        setPage(1);
        getPurchasedProduct(page, formData.userId, null, 'all');
        break;
      case menuList[2]:
        setPage(1);
        getMyReports(page, formData.userId);
        break;
    }
  }, [selectedMenu]);

  useEffect(() => {
    if (selectedMenu === menuList[0]) {
      if (selectedTab === 0) {
        getSalesProducts(page, formData.userId);
      } else if (selectedTab === 1) {
        getSalesProducts(page, formData.userId, null, '1');
      } else if (selectedTab === 2) {
        getSalesProducts(page, formData.userId, null, '2');
      } else if (selectedTab === 3) {
        getSalesProducts(page, formData.userId, null, '3');
      }
    } else if (selectedMenu === menuList[1]) {
      if (selectedTab === 0) {
        getPurchasedProduct(page, formData.userId, null, 'all');
      } else if (selectedTab === 1) {
        getPurchasedProduct(page, formData.userId, null, 'before');
      } else if (selectedTab === 2) {
        getPurchasedProduct(page, formData.userId, null, 'after');
      }
    } else if (selectedMenu === menuList[2]) {
      getMyReports(page, formData.userId);
    }
  }, [page]);

  const getUserInfo = async (e) => {
    try {
      const response = await fetch(`/api/users/${formData.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getCookie('token'),
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (data && data !== null) {
          setFormData({
            userId: data.userId,
            userName: data.userName,
            userPhoneNumber: data.userPhoneNumber,
            cdBankcode: data.cdBankcode,
            userAccount: data.userAccount,
            joinDate: data.joinDate,
            isInsurance: data.ynInsurance,
          });
        } else {
          toast({
            title: '오류 발생',
            description: '가입 정보가 없습니다.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        }
      } else {
        // 응답이 성공적이지 않은 경우
        toast({
          title: '오류 발생',
          description: '데이터 전송에 실패했습니다.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: '오류 발생',
        description: error.message || '데이터 전송에 실패했습니다.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const getMyReports = (page, id, search) => {
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('page', page - 1);

    fetch(`/api/reports/${id}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMyReports(data.content);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error('fetch error about my report');
      });
  };

  const getSalesProducts = (pageNum, id, search, state) => {
    if (pageNum <= 0) {
      setPage(1);
      pageNum = 1;
    }
    if (state === '0') {
      state = 'null';
    }
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('state', state);
    params.append('page', pageNum - 1);

    fetch(`/api/products/my/${id}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSalesProducts(data.content);
        setTotalElements(data.totalElements);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('fetch error about my product', error);
      });
  };

  const getPurchasedProduct = (pageNum, id, search, state) => {
    console.log(pageNum);
    console.log(id);
    console.log(search);
    console.log(state);
    const params = new URLSearchParams();
    params.append('search', search);
    params.append('state', state);
    params.append('page', pageNum - 1);

    fetch(`/api/products/my-purchased/${id}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPurchasedProducts(data.content);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error('fetch error about my purchased product', error);
      });
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSalesTabClick = (state) => {
    setPage(1);
    getSalesProducts(page, formData.userId, null, state);
  };

  const handlePurchaseTabClick = (state) => {
    setPage(1);
    getPurchasedProduct(page, formData.userId, null, state);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      setPage(1);
      setSelectedTab(0);
      if (selectedMenu === menuList[0]) {
        getSalesProducts(page, formData.userId, searchInput);
      } else if (selectedMenu === menuList[1]) {
        getPurchasedProduct(page, formData.userId, searchInput);
      } else if (selectedMenu === menuList[2]) {
        getMyReports(page, formData.userId, searchInput);
      }
    }
  };

  return (
    <Box w="1280px" maxWidth="container.xl" mb={10} mt={66}>
      <UserProfile user={formData} />
      <Flex justifyContent="center">
        <Box borderRightWidth="1px" mr={30} pr={30} mt={20}>
          {/* <Box display="flex" alignItems="flex-start" paddingBottom="50px">
            <Text as="b" fontSize="2xl">
              마이 페이지
            </Text>
          </Box> */}
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <RenderMenu menuList={menuList} handleMenuClick={handleMenuClick} />
          </Box>
        </Box>
        <Box flexDirection="column" flex={1}>
          <Box display="flex" alignItems="flex-start" paddingTop="80px" paddingBottom="10px">
            {/* <Text as="b" fontSize="xl" data-cy="selecteMenu-my">
              {selectedMenu}
            </Text> */}
          </Box>
          <Box>
            <Tabs size="md" colorScheme="black" index={selectedTab} onChange={(index) => setSelectedTab(index)}>
              <UserTabList
                selectedMenu={selectedMenu}
                handleSalesTabClick={handleSalesTabClick}
                handlePurchaseTabClick={handlePurchaseTabClick}
              />
              <VStack spacing={10} align="stretch" justify="center" mt={10}>
                <HStack display="flex" justifyContent="space-between">
                  <Text size="sm" mt={3} color="color.gray_2">
                    총 {`${totalElements}개`}
                  </Text>
                  <InputGroup size="md" maxW="210px">
                    <Input
                      data-cy="search-input-my"
                      border="2px"
                      borderColor="color.gray_1"
                      _hover={{ bgColor: 'transparent' }}
                      _focus={{
                        borderColor: 'color.gray_1',
                        boxShadow: 'none',
                      }}
                      bg="white"
                      borderRadius="md"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <InputRightElement>
                      <Button
                        data-cy="search-btn-my"
                        size="sm"
                        variant="ghost"
                        _hover={{ bgColor: 'transparent' }}
                        onClick={() => handleSearch()}>
                        <SearchIcon color="color.gray_1" boxSize="4" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </HStack>
                <UserTabPanels
                  selectedMenu={selectedMenu}
                  salesProducts={salesProducts}
                  purchasedProducts={purchasedProducts}
                  myReports={myReports}
                  page={page}
                  setPage={setPage}
                  userId={formData.userId}
                  selectedTab={selectedTab}
                  getSalesProducts={getSalesProducts}
                  getPurchasedProduct={getPurchasedProduct}
                  isLoading={isLoading}
                />
                <Pagination
                  activePage={page}
                  itemsCountPerPage={5}
                  totalItemsCount={totalElements}
                  pageRangeDisplayed={5}
                  prevPageText={'‹'}
                  nextPageText={'›'}
                  onChange={handlePageChange}
                />
              </VStack>
            </Tabs>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default MyPage;
