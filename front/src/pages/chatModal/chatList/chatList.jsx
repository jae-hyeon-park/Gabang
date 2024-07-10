import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client/dist/sockjs.js';
import { over } from 'stompjs';
import Chat from '../chat/chat';
import { Box, Drawer, DrawerOverlay, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton,
        Stack, Center, Text, Flex, Avatar, Alert, 
        Icon} from '@chakra-ui/react';
import { ChatIcon, WarningIcon } from '@chakra-ui/icons';
import { getPayload, isAuth, getCookie } from '../../../utils/cookie';

var stompClient = null;
const ChatList = ({ isOpenChatList, onCloseChatList }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(0);

  const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' {...props}>
      <path
        fill='currentColor'
        d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
  )

  useEffect(() => {
    if (isOpenChatList) {
      connect();
    }
  }, [isOpenChatList]);

  const connect = () => {
    let Sock = new SockJS('/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    fetchChatList();
  
    stompClient.subscribe('/chat/list', fetchChatList);
  };

  const fetchChatList = () => {
    if (isAuth('token')) {
      const user = getPayload('token').userId;
      var userId;

      if (getPayload('token').role === 'ROLE_ADMIN') {
        userId = 'chat';
      } else {
        userId = user;
      }
      const url = `/api/chat/list?userId=${userId}`;
  
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Chat list data:', data);
          const fetchedChatList = data.map(chatRoom => {

            if (chatRoom.messages[chatRoom.messages.length - 1].messageType === 'decision' && chatRoom.messages[chatRoom.messages.length - 1].sender === userId) {
              const filteredMessages = chatRoom.messages.filter(message => message.messageType !== 'decision');
              const lastMessageInfo = filteredMessages.length > 0 ? filteredMessages[filteredMessages.length - 1] : null;
              
              const lastMessage = lastMessageInfo ? lastMessageInfo.contents : "";
              const lastSender = lastMessageInfo ? lastMessageInfo.sender : "";
              const lastInput = lastMessageInfo ? lastMessageInfo.inputDate : "";

              const otherUser = chatRoom.user1 === userId ? chatRoom.user2 : chatRoom.user1;
              const productId = chatRoom.productId;

              return {
                ...chatRoom,
                lastMessage,
                lastSender,
                lastInput,
                otherUser,
                productId
              };
            } 

            else {
              const lastMessage = chatRoom.messages[chatRoom.messages.length - 1].contents; // 마지막 메시지
              const lastSender = chatRoom.messages[chatRoom.messages.length - 1].sender;
              const lastInput = chatRoom.messages[chatRoom.messages.length - 1].inputDate;
              const otherUser = chatRoom.user1 === userId ? chatRoom.user2 : chatRoom.user1; // 상대방 정보
              const productId = chatRoom.productId;
  
              return {
                ...chatRoom,
                lastMessage,
                lastSender,
                lastInput,
                otherUser,
                productId
              };
            }
          });
  
          // 최신 메시지를 기준으로 정렬
          fetchedChatList.sort((a, b) => {
            const timeA = new Date(a.messages[a.messages.length - 1].inputDate);
            const timeB = new Date(b.messages[b.messages.length - 1].inputDate);
            return timeB - timeA;
          });
  
          // 채팅 목록 설정
          setChatList(fetchedChatList);
  
          // 각 채팅 방의 상품 이미지 가져오기
          fetchedChatList.forEach(chat => {
            fetchProductImage(chat.productId)
              .then(productData => {
                const productImage = productData.imageURLs[0];

                setChatList(prevChatList => {
                  return prevChatList.map(prevChat => {
                    if (prevChat.roomId === chat.roomId) {
                      return {
                        ...prevChat,
                        productImage: productImage
                      };
                    }
                    return prevChat;
                  });
                });
              })
              .catch(error => {
                console.error('Fetching product image failed:', error);
              });
          });


        })
        .catch(error => {
          console.error('Error fetching chat list:', error);
        });
    }
  };
  
  const fetchProductImage = (productId) => {
    const url = `/api/products/${productId}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Fetching product details failed:', error);
      });
  };

  const onError = (err) => {
    console.error(err);
  };


  const formatTime = (lastInput) => {
    const date = new Date(lastInput);
    const currentDate = new Date();
    
    // 날짜가 오늘과 같은 경우
    if (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    ) {
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Seoul'
      };
      const formattedTime = date.toLocaleTimeString('ko-KR', timeOptions);
      return formattedTime;
    } else {
      const formattedDate = date.toLocaleDateString('ko-KR');
      return formattedDate.slice(0, -1);
    }
  };

  const handleClick = (chat, roomId) => {
    setSelectedChat(chat);
    setChatRoomId(roomId);
    setIsChatOpen(true);
  };

  const onBackList = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <Drawer data-cy="chat-list" isOpen={isOpenChatList} placement="right" onClose={onCloseChatList} size="sm">
        <DrawerOverlay />
        <DrawerContent>
        {isChatOpen ? (
          <Chat
            isOpenChatList={isOpenChatList}
            onBackList={onBackList}
            selectedChat={selectedChat}
            chatRoomId={chatRoomId}
            />
          )  : (
          <>
            <DrawerCloseButton size="lg" />
            <DrawerHeader borderBottomWidth="1px">
              <Center>
                <ChatIcon /> 
                { isAuth('token') && getPayload('token').role === 'ROLE_ADMIN' ? (
                  <span style={{ margin: '0 0.5em' }}>문의 내역</span>
                  ) : (
                  <span style={{ margin: '0 0.5em' }}>채팅</span> 
                  )
                }
              </Center>
            </DrawerHeader>
            <DrawerBody>
                
              { isAuth('token') && getPayload('token').role !== 'ROLE_ADMIN' &&
              <Stack spacing={3}>
                <Alert status="info">
                <WarningIcon mr={1}/>
                <Text p={2}>가방안전결제로 안전하게 거래하세요</Text>
                </Alert>
              </Stack>
              }

                { chatList.length == 0 ? (
                  <Box p="3" display="flex" justifyContent="center" alignItems="center" h="60%">
                      <Text>
                        { isAuth('token') && getPayload('token').role !== 'ROLE_ADMIN' ? '채팅' : '문의'}
                        내역이 없습니다</Text> 
                  </Box>             
                ) : (
                  chatList
                  .filter(chat => chat.otherUser !== 'chat' && chat.otherUser !== 'otherUser')
                  .map((chat) => (
                  <Box
                  key={chat.roomId}
                  p="3"
                  cursor="pointer"
                  _hover={{ backgroundColor: 'gray.100' }}
                  onClick={() => handleClick(chat, chat.roomId)}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Flex>
                    <Avatar bg="teal.500" name={chat.otherUserName} src={chat.otherUserAvatar} />
                    <Flex flexDirection="column" mx="4" justify="center">

                    <Flex alignItems="center">
                      <Text fontSize="lg" fontWeight="bold">
                        {chat.otherUser}
                      </Text>
              
                     <CircleIcon boxSize={2.5} color= 'white' />
                    <Text fontSize="xs">{formatTime(chat.lastInput)}</Text>
                    <CircleIcon boxSize={2} m='3' color= {chat.lastSender === chat.otherUser ? 'red.400' : 'white'}/>
                      </Flex>

                      <Text >{chat.lastMessage}</Text>
                    </Flex>
                  </Flex>
                  <Flex alignItems="center">
                    { chatList.length > 0 && isAuth('token') && getPayload('token').role !== 'ROLE_ADMIN' &&
                    <Avatar
                      size="md" borderRadius="10"
                      name="product" src={chat.productImage} />
                    }
                  </Flex>
                </Box>
                )))}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatList;