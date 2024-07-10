import React, { useState } from 'react';
import Chat from './chat/chat';
import ChatRoom from './chatRoom';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { ChatIcon, WarningIcon } from '@chakra-ui/icons';
import { AiOutlineUser } from 'react-icons/ai';

const ChatModal = ({ isOpenChatList, onCloseChatList, productId, productDetail }) => {
  const [isChatOpen, setIsChatOpen] = useState(false); // 1:1 채팅화면 상태 관리

  const handleClick = () => {
    setIsChatOpen(!isChatOpen); // 클릭 시 채팅창을 열거나 닫도록 상태를 변경합니다.
  };

  const onBackList = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <Drawer isOpen={isOpenChatList} onClose={onCloseChatList} placement="right" size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <ChatRoom isOpenChatList={isOpenChatList} onBackList={onBackList} productId={productId} productDetail={productDetail} />
          {/* <Chat onBackList={onBackList} /> */}
          <DrawerCloseButton size="lg" />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChatModal;
