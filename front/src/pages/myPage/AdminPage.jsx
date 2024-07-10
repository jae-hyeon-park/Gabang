import { Box, Button, Text, Tabs, Flex, InputGroup, Input, InputRightElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import React, { useState, useEffect } from 'react';
import RenderMenu from './components/RenderMenu';
import AdminTabList from './components/AdminTabList';
import AdminTabPanels from './components/AdminTabPanels';
import Pagination from 'react-js-pagination';
import './style/pagination.css';
import { getCookie } from '../../utils/cookie';

export const AdminPage = () => {
  const menuList = ['사용자 조회', '상품 관리', '신고 내역'];

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(menuList[0]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setSelectedTab(0);
    switch (selectedMenu) {
      case '사용자 조회':
        setPage(1);
        getUsers(page);
        break;
      case '상품 관리':
        setPage(1);
        getProducts(page);
        break;
      case '신고 내역':
        setPage(1);
        getReports(page);
        break;
      default:
        break;
    }
  }, [selectedMenu]);

  useEffect(() => {
    if (selectedMenu === menuList[0]) {
      if (selectedTab === 0) {
        getUsers(page);
      } else if (selectedTab === 1) {
        getAdmins(page);
      }
    } else if (selectedMenu === menuList[1]) {
      getProducts(page);
    } else if (selectedMenu === menuList[2]) {
      getReports(page);
    }
  }, [page]);

  const getAdmins = (page, search) => {
    fetch(`/api/admin/users?role=admin&search=${search}&page=${page - 1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.content);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error('fetch error about admin');
      });
  };

  const getUsers = (page, search) => {
    fetch(`/api/admin/users?search=${search}&page=${page - 1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.content);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error('fetch error about user');
      });
  };

  const getProducts = (page, search) => {
    fetch(`/api/products/page?search=${search}&page=${page - 1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.content);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error('fetch error about product');
      });
  };

  const getReports = (page, search) => {
    fetch(`/api/admin/reports?search=${search}&page=${page - 1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setReports(data.content);
        setTotalElements(data.totalElements);
      })
      .catch((error) => {
        console.error('fetch error about report');
      });
  };

  const handleAdminTabClick = () => {
    setPage(1);
    getAdmins(1);
  };

  const handleAllUserTabClick = () => {
    setPage(1);
    getUsers(1);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handlePageChange = (page) => {
    setPage(page);
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
        getUsers(page, searchInput);
      } else if (selectedMenu === menuList[1]) {
        getProducts(page, searchInput);
      } else if (selectedMenu === menuList[2]) {
        getReports(page, searchInput);
      }
    }
  };

  return (
    <Box w="1280px" maxWidth="container.xl" mb={10}>
      <Flex justifyContent="center">
        <Box borderRightWidth="2px" borderColor="gray.200" mt={100} mr={30} pr={30}>
          <Box display="flex" alignItems="flex-start" paddingBottom="50px">
            <Text as="b" fontSize="2xl">
              관리자 페이지
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <RenderMenu menuList={menuList} handleMenuClick={handleMenuClick} />
          </Box>
        </Box>
        <Box mt={100} flexDirection="column" flex={1}>
          <Box display="flex" alignItems="flex-start" paddingTop="80px" paddingBottom="10px">
            <Text as="b" fontSize="xl" data-cy='selecteMenu-admin'>
              {selectedMenu}
            </Text>
          </Box>
          <Box>
            <Tabs size="md" colorScheme="black" index={selectedTab} onChange={(index) => setSelectedTab(index)}>
              <AdminTabList
                selectedMenu={selectedMenu}
                onAdminTabClick={handleAdminTabClick}
                onAllUserTabClick={handleAllUserTabClick}
              />
              <Flex justifyContent="space-between">
                <Text size="sm" mt={3} color="gray">
                  총 {`${totalElements}개`}
                </Text>
                <InputGroup size="md" maxW="210px" ml={3} mr={0.5} mt={3}>
                  <Input
                    data-cy="search-input-admin"
                    border="2px"
                    borderColor="color.blue"
                    _hover={{ bgColor: 'transparent' }}
                    _focus={{
                      borderColor: 'color.blue',
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
                      data-cy="search-btn-admin"
                      size="sm"
                      variant="ghost"
                      _hover={{ bgColor: 'transparent' }}
                      onClick={() => handleSearch()}>
                      <SearchIcon color="color.blue" boxSize="4" />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Flex>
              <AdminTabPanels
                selectedMenu={selectedMenu}
                users={users}
                admins={users}
                reports={reports}
                products={products}
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
            </Tabs>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminPage;
