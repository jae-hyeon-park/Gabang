import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client/dist/sockjs.js';
import { over } from 'stompjs';
import { Flex, Text, Box, Textarea, Avatar, Stack, Alert, Button, Input } from "@chakra-ui/react";
import { CalendarIcon, WarningIcon } from "@chakra-ui/icons";
import Header from "./components/ChatHeader";
import Divider from "./components/ChatDivider"
import { getPayload, getCookie } from '../../../utils/cookie';

var stompClient = null;
const Chat = ({ isOpenChatList, onBackList, selectedChat, chatRoomId }) => {
  console.log(selectedChat);

  const user = getPayload('token').userId;
  var userId;

  if (getPayload('token').role === 'ROLE_ADMIN') {
    userId = 'chat';
  } else {
    userId = user;
  }

  const [inputMessage, setInputMessage] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [publicChats, setPublicChats] = useState([]);
  const [userData, setUserData] = useState({
    username: user,
    receiver: selectedChat.user1 === user ? selectedChat.user2 : selectedChat.user1,
    inputDate: '',
    connected: true,
    message: '',
  });
  
  useEffect(() => {
    if (isOpenChatList) {
      connect(); // 모달이 열렸을 때 연결
    } 
  }, [isOpenChatList]);

  const connect = () => {
    let Sock = new SockJS('/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };
  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe('/chat/private', onMessageReceived);
    requestPreviousMessages(chatRoomId);
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
          inputDate: new Date(message.inputDate),
          messageType: message.messageType
        }));

        // 시간순으로 정렬
        previousMessages.sort((a, b) => new Date(a.inputDate) - new Date(b.inputDate));
                
        // 이전 메시지를 publicChats에 추가
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
        productId: selectedChat.productId,
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



  const handleAccept = () => {
    if (stompClient && inputMessage.trim() !== '') {
      let offset = new Date().getTimezoneOffset() * 60000;
      let date = new Date(new Date().getTime() - offset);

      const chatMessage = {
        sender: userData.receiver,
        receiver: userData.username,
        contents: '판매가 수락되었습니다',
        status: 'MESSAGE',
        inputDate: date.toISOString(),
        productId: selectedChat.productId,
        connected: userData.connected
      };
      
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    }
  }


  const handleReject = () => {
    fetch(`/api/payment?productId=${selectedChat.productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getCookie('token')
      },
      body: JSON.stringify({
        productId: selectedChat.productId,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };



  return (
  <>
      <Flex w="100%" h="100%">
      <Flex w={["100%", "100%", "100%"]} h="100%" flexDir="column">
        <Header onBackList={onBackList} selectedChat={selectedChat} />
        <Divider />
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

          
          {(chat.sender === userId && chat.messageType !== 'decision') && (
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

        {(chat.sender !== userId && chat.messageType !== 'decision') && (
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

        {(chat.sender !== userId && chat.messageType === 'decision') && (
        <Flex w="100%" justify="flex-start" mb="1" >
          <Flex
            bg="gray.100"
            color="black"
            maxW="70%"
            ml="2"
            mt="5"
            p="5"
            borderRadius="10"
            flexDirection="column"
            border="2px" borderColor="white"
          >
            <Text mb="2">{chat.contents}</Text>
            <Flex justify="center">
              <Button mr="2" bgColor="skyblue" border="2px" borderColor="white" borderRadius="5" size="sm" onClick={() => handleAccept()}>수락</Button>
              <Button bgColor="skyblue" border="2px" borderColor="white" borderRadius="5" size="sm" onClick={() => handleReject()}>거절</Button>
            </Flex>
          </Flex>
          <Text alignSelf="flex-end" fontSize='sm' color='gray.700' mb="1" ml="1" >
            {new Date(chat.inputDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </Text>
          </Flex>

        )}

    

        </Flex>
        ))}
        <AlwaysScrollToBottom />
      </Flex>
      <Box>
      <Stack spacing={3}>
        <Alert status="info">
          <WarningIcon mr={1}/>
          <Text p={2}>가방안전결제로 안전하게 거래하세요</Text>
        </Alert>
      </Stack>
      <Flex w="100%" flexDirection="column">
        <Textarea
          value={inputMessage}
          resize="none"
          placeholder="채팅을 입력해주세요"
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
          disabled={getPayload('token').role === 'ROLE_ADMIN' && user !== 'chat'} 
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
    </>
  );
};

export default Chat;
