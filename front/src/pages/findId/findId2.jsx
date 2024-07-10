// App.js
import React, { useState } from "react";
import { ChakraProvider, Container, Input, Button, Box, Text, FormLabel, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

function FindId2() {
  const location = useLocation();

  const userId = location.state ? location.state.userId : '';
  const joinDate = location.state ? location.state.joinDate : '';
  const navigate = useNavigate(); 

  const handleNavigate = (path, state) => {
    navigate(path, { state: state });
    window.scrollTo(0, 0);
  };

  return (
    <Box w="md" p={4} borderWidth="1px" borderRadius="lg">
      <FormLabel textAlign="left" fontSize="3xl" fontWeight="bold">아이디 찾기</FormLabel>
      <Text mt={8}>고객님의 정보와 일치하는 아이디 목록입니다.</Text>
      <Box borderWidth="1px" borderRadius="lg" p={4} mt={4}>
        <Flex justifyContent="space-between">
          <Text fontWeight="bold">{userId}</Text>
          <Text>가입일: {joinDate.substr(0, 10)}</Text>
        </Flex>
      </Box>
      <Flex justifyContent="space-between" mt={8}>
        <Button
          bgColor="#3770FB"
          textColor="white"
          fontSize="xl"
          w="100%"
          onClick={() => handleNavigate("/signin", {userId})}
          _hover={{
            bgColor: '#3770FB',
            textColor: 'white',
          }}
          mr={2}
          >
          로그인하기
        </Button>
        <Button
          onClick={() => handleNavigate("/help/pw", {userId})}
          bgColor='white'
          textColor='black'
          borderColor="gray"
          borderWidth="1px"
          _hover={{
            bgColor: 'white',
            textColor: 'black',
          }}
          fontSize="xl"
          w="100%"
        >
          비밀번호찾기
        </Button>
      </Flex>
    </Box>
  );
}

export default FindId2;
