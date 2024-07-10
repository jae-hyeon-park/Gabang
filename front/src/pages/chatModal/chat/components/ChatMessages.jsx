import React, { useEffect, useRef } from "react";
import { Flex, Text } from "@chakra-ui/react";

const Messages = ({ messages }) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  return (
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => (
        <Flex key={index} w="100%" justify={item.from === 'me' ? 'flex-end' : 'flex-start'}>
          <Flex
            bg={item.from === 'me' ? 'blue.500' : 'gray.100'}
            color={item.from === 'me' ? 'white' : 'black'}
            minW="100px"
            maxW="350px"
            mr={item.from === 'me' ? '2' : '0'}
            ml={item.from === 'me' ? '0' : '2'}
            my="1"
            p="3"
            borderRadius="10"
          >
            <Text>{item.text}</Text>
          </Flex>
        </Flex>
      ))}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Messages;
