import React, { useState } from "react";
import { Box, Flex, Textarea, Text, Avatar } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const Footer = ({ inputMessage, setInputMessage, handleSendMessage, onClick }) => {
  const [inputCount, setInputCount] = useState(0);

  return (
    <Box>
      <Flex w="100%" flexDirection="column">
        <Textarea
          resize="none"
          placeholder="채팅을 입력해주세요"
          border="none"
          borderRadius="none"
          _focus={{
            boxShadow: "none",
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
            setInputCount(e.target.value.length);
          }}
          maxLength="200"
          rows="4"
          marginBottom="0" 
        />
        <Flex justifyContent="flex-end">
          <Text mr="1">
            {inputCount}/200
          </Text>
          <Avatar
            mr="2"
            mb="2"
            size='sm'
            src='/images/chat.png' 
            disabled={inputMessage.trim().length <= 0}
            onClick={onClick}
            cursor="pointer"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
