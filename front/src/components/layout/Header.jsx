import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client/dist/sockjs.js';
import { over } from 'stompjs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Input,
  Button,
  Flex,
  InputGroup,
  InputRightElement,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Icon,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import ChatList from '../../pages/chatModal/chatList/chatList';
import { SearchIcon, HamburgerIcon, ChatIcon } from '@chakra-ui/icons';
import categories from '../../pages/products/components/category';
import ConfirmationModal from '../common/ConfirmationModal';
import { getPayload, isAuth, removeCookie } from '../../utils/cookie';
import Inquiry from '../../pages/chatModal/inquiry/inquiry';

const getCategoryIDByName = (categoryName) => {
  return categories[categoryName];
};

let stompClient = null;
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [searchInput, setSearchInput] = useState('');
  const btnRef = React.useRef();
  const { isOpen: isOpenChatList, onOpen: onOpenChatList, onClose: onCloseChatList } = useDisclosure();
  const { isOpen: isOpenInquiry, onOpen: onOpenInquiry, onClose: onCloseInquiry } = useDisclosure();
  const [showModal, setShowModal] = useState(false);

  const toast = useToast();
  const CustomToast = ({ title }) => {
    return (
      <Box color="white" p={3} bg="blue.400" borderRadius="md" boxShadow="lg" display="flex" alignItems="center">
        <Icon as={ChatIcon} w={6} h={6} mx={3} />
        {title}
      </Box>
    );
  };

  let userId;
  if (isAuth('token')) {
    userId = getPayload('token').userId;
  }

  const logOut = () => {
    setShowModal(false);
    navigate('/');
    window.scrollTo(0, 0);
    removeCookie('token');
  };

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`);
      window.scrollTo(0, 0);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleMyPageClick = () => {
    const payLoad = getPayload('token');
    payLoad.role === 'ROLE_ADMIN'
      ? handleNavigate(`/admin/${payLoad.userId}`)
      : handleNavigate(`/my/${payLoad.userId}`);
  };

  const handleCategoryClick = (categoryName) => {
    onClose();
    const categoryId = getCategoryIDByName(categoryName);
    if (categoryId === 0) {
      navigate(`/products`);
    } else {
      navigate(`/products?category=${categoryId}`);
    }
    window.scrollTo(0, 0);
  };

  const handleChatListClick = () => {
    if (isAuth('token')) {
      onOpenChatList();
    } else {
      alert('로그인이 필요합니다.');
      handleNavigate(`/signin`);
    }
  };

  const handleInquiryClick = () => {
    onOpenInquiry();
  };

  useEffect(() => {
    if (isAuth('token')) {
      connect();
    }
  }, [userId]);

  const connect = () => {
    const Sock = new SockJS('/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe(`/user/${userId}/chat/notification`, (message) => {
      onMessageReceived(JSON.parse(message.body));
    });
  };

  const onMessageReceived = (message) => {
    toast({
      position: 'bottom-right',
      duration: 5000,
      render: () => <CustomToast title="채팅 메시지가 도착했습니다" />,
      isClosable: true,
    });
  };

  const onError = (error) => {
    console.error('Connection Error: ' + error);
  };

  return (
    <div className="header">
      <Flex
        position="fixed"
        top="0"
        left="0"
        h="20"
        borderBottomWidth={isHomePage ? '0px' : '1px'}
        borderColor="gray.200"
        bg={isHomePage ? 'color.blue' : 'white'}
        color={isHomePage ? 'white' : 'black'}
        zIndex="banner"
        width="100%"
        justifyContent="center">
        <Flex justifyContent="space-between" alignItems="center" w="1280px" maxWidth="container.xl">
          <Flex>
            <Button
              ref={btnRef}
              colorScheme="blue"
              onClick={onOpen}
              variant="ghost"
              p={0}
              mr={3}
              size="xl"
              _hover={{ bgColor: isHomePage ? 'color.blue' : 'white' }}>
              <HamburgerIcon w={8} h={8} color={isHomePage ? 'white' : 'black'} />
            </Button>
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
              <DrawerOverlay />
              <DrawerContent p={4}>
                <DrawerCloseButton sx={{ margin: '6' }} />
                <DrawerHeader fontWeight="bold" fontSize="2xl">
                  카테고리
                </DrawerHeader>
                <DrawerBody>
                  <VStack align="start">
                    {[
                      '전체',
                      '전자기기',
                      '가구 및 인테리어',
                      '유아동',
                      '패션 및 잡화',
                      '생활주방',
                      '식품',
                      '스포츠레저',
                      '취미/게임/음반',
                      '뷰티/미용',
                      '식물',
                      '반려동물용품',
                      '티켓/교환권',
                      '도서',
                      '기타중고물품',
                    ].map((category) => (
                      <Box width="100%" key={category}>
                        <Button
                          variant="ghost"
                          width="100%"
                          justifyContent="start"
                          _hover={{ color: 'color.blue', bgColor: 'transparent' }}
                          onClick={() => handleCategoryClick(category)}>
                          {category}
                        </Button>
                      </Box>
                    ))}
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
            <Image
              src={isHomePage ? '/images/logo2(ko).png' : '/images/logo1(ko).png'}
              style={{ width: '110px' }}
              pb="2"
              onClick={() => handleNavigate(`/`)}
              cursor="pointer"
            />
            {!isHomePage && (
              <InputGroup size="md" maxW="sm" ml={3} alignItems="center">
                <Input
                  border="2px"
                  borderColor="black"
                  _hover={{ bgColor: 'transparent' }}
                  _focus={{
                    borderColor: 'black',
                    boxShadow: 'none',
                  }}
                  placeholder="에어팟"
                  bg="white"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement>
                  <Button size="sm" variant="ghost" _hover={{ bgColor: 'transparent' }} onClick={handleSearch}>
                    <SearchIcon color="black" boxSize="4" mt={2} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            )}
          </Flex>
          <Flex gap={8}>
            <Button
              variant="ghost"
              color="black"
              fontSize={20}
              p={0}
              textColor={isHomePage ? 'white' : 'black'}
              bgColor={isHomePage ? 'color.blue' : 'white'}
              _hover={{
                bgColor: isHomePage ? 'color.blue' : 'white',
                color: isHomePage ? 'color.yellow' : 'color.blue',
              }}
              transition="none"
              onClick={() => handleNavigate(`/product/regist`)}>
              판매하기
            </Button>
            <Button
              data-cy="open-chatList-button"
              onClick={handleChatListClick}
              variant="ghost"
              color="black"
              fontSize={20}
              p={0}
              textColor={isHomePage ? 'white' : 'black'}
              bgColor={isHomePage ? 'color.blue' : 'white'}
              _hover={{
                bgColor: isHomePage ? 'color.blue' : 'white',
                color: isHomePage ? 'color.yellow' : 'color.blue',
              }}
              transition="none">
              {isAuth('token') && getPayload('token').role === 'ROLE_ADMIN' ? '문의목록' : '채팅목록'}
            </Button>
            {isAuth('token') ? (
              <Menu>
                <MenuButton
                  variant="ghost"
                  color="black"
                  fontSize={20}
                  p={0}
                  fontWeight={600}
                  textColor={isHomePage ? 'white' : 'black'}
                  bgColor={isHomePage ? 'color.blue' : 'white'}
                  _hover={{
                    bgColor: isHomePage ? 'color.blue' : 'white',
                    color: isHomePage ? 'color.yellow' : 'color.blue',
                  }}>
                  마이
                </MenuButton>
                <MenuList>
                  <MenuItem
                    fontWeight={500}
                    textColor="black"
                    _hover={{ color: 'color.blue', bgColor: 'transparent' }}
                    onClick={() => handleMyPageClick()}>
                    마이페이지
                  </MenuItem>
                  {getPayload('token').role !== 'ROLE_ADMIN' && (
                    <MenuItem
                      fontWeight={500}
                      textColor="black"
                      _hover={{ color: 'color.blue', bgColor: 'transparent' }}
                      onClick={() => handleInquiryClick()}>
                      문의하기
                    </MenuItem>
                  )}
                  <MenuItem
                    fontWeight={500}
                    textColor="black"
                    _hover={{ color: 'color.blue', bgColor: 'transparent' }}
                    onClick={() => setShowModal(true)}>
                    로그아웃
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                variant="ghost"
                color="black"
                fontSize={20}
                p={0}
                textColor={isHomePage ? 'white' : 'black'}
                bgColor={isHomePage ? 'color.blue' : 'white'}
                _hover={{
                  bgColor: isHomePage ? 'color.blue' : 'white',
                  color: isHomePage ? 'color.yellow' : 'color.blue',
                }}
                transition="none"
                onClick={() => handleNavigate(`/signin`)}>
                로그인
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>

      <ChatList isOpenChatList={isOpenChatList} onCloseChatList={onCloseChatList} />
      <Inquiry isOpenInquiry={isOpenInquiry} onCloseInquiry={onCloseInquiry} />
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={() => logOut()}
        message={'로그아웃하시겠습니까?'}
        onCancel={() => setShowModal(false)}
        isCancelButtion={true}
        isConfirmButton={true}
      />
    </div>
  );
};

export default Header;
