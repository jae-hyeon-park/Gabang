import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client/dist/sockjs.js';
import { over } from 'stompjs';
// import SockJS from 'sockjs-client';
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
        Flex, Text, Box, Textarea, Avatar, Stack, Alert, 
        DrawerHeader,
        Center,
        useDisclosure,
        Button,
        Slide, Divider} from "@chakra-ui/react";
import { CalendarIcon, ChatIcon, QuestionIcon, QuestionOutlineIcon, WarningIcon } from "@chakra-ui/icons";
// import Divider from "./components/ChatDivider"
import { getPayload, isAuth } from '../../../utils/cookie';
import logo from '../../../assets/bag.png';

var stompClient = null;
var user = null;

const Inquiry = ({ isOpenInquiry, onCloseInquiry }) => {

    if (isAuth('token')) {
        user = getPayload('token').userId;
        
    }
 
    const { isOpen, onToggle } = useDisclosure()

  const [inputMessage, setInputMessage] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [publicChats, setPublicChats] = useState([]);
  const [userData, setUserData] = useState({
    username: user,
    receiver: 'chat',
    inputDate: '',
    connected: false,
    message: '',
  });
  useEffect(() => {
    if (isOpenInquiry && !userData.connected) {
      connect();
    }
  }, [isOpenInquiry]);

  const connect = () => {
    let Sock = new SockJS('/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe('/chat/private', onMessageReceived);

    // 기존 채팅방이 있는지 확인
    findExistingChatRoom();
  
  };

  const findExistingChatRoom = () => {
    const url = '/api/chat/room'; 
    const params = new URLSearchParams({
      productId: 37,
      user1: user, 
      user2: 'chat'
    });
    
    fetch(url + '?' + params)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to check chat room');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.exist) {
          requestPreviousMessages(data.roomId);
        } 
      })
      .catch(error => {
        console.error('Error checking chat room:', error.message);
      });
  };


  const requestPreviousMessages = (roomId) => {
    const url = `/api/chat/messages?roomId=${roomId}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch previous messages');
        }
        return response.json();
      })
      .then(data => {

        const previousMessages = data.map(message => ({
          sender: message.sender,
          contents: message.contents,
          inputDate: new Date(message.inputDate)
        }));

        // 시간순으로 정렬
        previousMessages.sort((a, b) => new Date(a.inputDate) - new Date(b.inputDate));
                
        setPublicChats([...publicChats, ...previousMessages]);

      })
      .catch(error => {
        console.error('Error fetching previous messages:', error.message);
      });
  };  

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case 'MESSAGE':
        setPublicChats(prevChats => [...prevChats, payloadData]);
        break;
    }
  };

  const onError = (err) => {
    console.error(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setInputMessage(value);
    setInputCount(value.length);
  };

  const sendMessage = () => {
    if (stompClient && inputMessage.trim() !== '') {
      let offset = new Date().getTimezoneOffset() * 60000;
      let date = new Date(new Date().getTime() - offset);

      const chatMessage = {
        sender: userData.username,
        receiver: userData.receiver,
        contents: inputMessage,
        status: 'MESSAGE',
        inputDate: date.toISOString(),
        productId: 37,
        connected: userData.connected
      };
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));

      setInputMessage("");
      setInputCount(0);
    }
  };


  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const isNewDate = (currentIndex, messages) => {
    const prevMessage = messages[currentIndex - 1];
    const currentMessageDate = new Date(messages[currentIndex].inputDate);
    const prevMessageDate = prevMessage ? new Date(prevMessage.inputDate) : null;
  
    return !prevMessageDate || currentMessageDate.getDate() !== prevMessageDate.getDate();
  };

  const getDayOfWeek = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  }

  return (
    <>
    <Drawer placement="right" size="sm" onClose={onCloseInquiry} isOpen={isOpenInquiry}>
        <DrawerOverlay />
        <DrawerContent>

        <DrawerCloseButton size="lg" />
            <DrawerHeader borderBottomWidth="1px">
              <Center>
                <QuestionIcon /> <span style={{ margin: '0 0.5em' }}>문의하기</span>
              </Center>
            </DrawerHeader>

        <Flex w="100%" h="100%">
        <Flex w={["100%", "100%", "100%"]} h="100%" flexDir="column">
        <Flex w="100%" justify="flex-start" mb="1">
        <Flex mt="8">
            
        <Avatar
          mt="1"ml="7" size="md" borderRadius="10"
          name="Gabang" src={logo}
          /> 
          <Flex flexDirection="column" mx="4" justify="center">
          <Text fontSize="lg" fontWeight="bold" mt="1">
          가방
          </Text>
          <Flex
            bg="gray.100"
            color="black"
            maxW="100%"
            my="1"
            p="3"
            borderRadius="10"
          >
          <Text>1:1 채팅을 통해 남겨주신 문의는 <br /> 영업일 기준 1일 이내에 답변드립니다</Text>
          </Flex>
          {/* <Text alignSelf="flex-end" fontSize='sm' color='gray.700' mb="1" ml="1" >
              {new Date(chat.inputDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </Text> */}
          </Flex>
          
        </Flex>
        
      </Flex>
      <Center>
        <Button onClick={onToggle} bg='blue.200' width='30%' _hover='none' m='2'>자주 묻는 질문</Button>
        </Center>
        

        



        <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
          {publicChats.map((chat, index) => (          
            <Flex key={index} flexDirection="column">
              {isNewDate(index, publicChats) && (
                <Box textAlign="center" fontSize={13} color='gray.600'
                  m="2" borderRadius="full" w="fit-content" py="3" mx="auto" >
                  <CalendarIcon mx="2" />
                {`   ${new Date(chat.inputDate).getFullYear()}년 ${new Date(chat.inputDate).getMonth() + 1}월 ${new Date(chat.inputDate).getDate()}일 ${getDayOfWeek(new Date(chat.inputDate))}요일`}
                </Box>
              )}





          
          {(chat.sender !== user) && (
          <Flex w="100%" justify="flex-start" mb="1">
          <Flex
            bg="gray.100"
            color="black"
            maxW="60%"
            ml="2"
            my="1"
            p="3"
            borderRadius="10"
          >
          <Text>{chat.contents}</Text>
          </Flex>
          <Text alignSelf="flex-end" fontSize='sm' color='gray.700' mb="1" ml="1" >
              {new Date(chat.inputDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </Text>
          </Flex>
          )}



                        
            {(chat.sender === user) && (
            <Flex justify='flex-end'>
            <Text alignSelf="flex-end" fontSize='sm' mb="1" mr="1">
              {new Date(chat.inputDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </Text>
            <Flex
              bg="blue.500"
              color="white"
              maxW="60%"
              mr="2"
              my="1"
              p="3"
              borderRadius="10"
              className="self"
            >
            <Text>{chat.contents}</Text>
          </Flex>
          </Flex>
          )}    

  
          </Flex>
          ))}
          <AlwaysScrollToBottom />
        </Flex>

        
      <Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
      <Divider w="100%" borderBottomWidth="2px" color="black" mt="2" />
        <Box
          p='5%'
          mt='4'
          bg='blue.100'
          rounded='md'
          shadow='md'
        >
          <Text>언제 구매 확정이 되나요?</Text>
          <Text>사기를 당했을 경우 신고는 어떻게 하나요?</Text>
          <Text>언제 구매 확정이 되나요?</Text>
          <Text>언제 구매 확정이 되나요?</Text>
          <Text>언제 구매 확정이 되나요?</Text>
          <Text>언제 구매 확정이 되나요?</Text>
        </Box>
      </Slide>

      <Box>
      <Stack spacing={3}>
        <Alert status="info">
          {/* <WarningIcon mr={1}/>
          <Text p={2}>가방ㄴ</Text> */}
        </Alert>
      </Stack>
         

        <Flex w="100%" flexDirection="column">
          <Textarea
            value={inputMessage}
            resize="none"
            placeholder="문의 내용을 입력해주세요"
            border="none" borderRadius="none"
            _focus={{
              boxShadow: "none",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 기본 동작 방지
                sendMessage();
              }
            }}
            onChange={handleMessage}
            maxLength="200" rows="4" marginBottom="0" 
          />
          <Flex justifyContent="flex-end">
            <Text mr="1">
              {inputCount}/200
            </Text>
            <Avatar
              mr="2" mb="2" size='sm' src='/images/chat.png' cursor="pointer"
              // disabled={inputMessage.trim().length <= 0}
              onClick={() => inputMessage.trim().length > 0 && sendMessage()}
            />
          </Flex>
        </Flex>
        </Box>
        </Flex>
      </Flex>
      <DrawerCloseButton size="lg" />
        </DrawerContent>
      </Drawer>
      </>
    );
};

export default Inquiry;
