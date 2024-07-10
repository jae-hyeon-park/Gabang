import React, { useState} from 'react';
import {
  Box, FormControl, FormLabel, Input, Button, VStack, Flex, Heading, useToast, Select, FormErrorMessage
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const findId = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const toast = useToast();

  const handleNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (phoneNumber.length !== 11) {
      setIsValid(false);
      setErrorMessage('휴대폰 번호는 11자리여야 합니다.');
      return;
    }
    try {
      const response = await fetch('/api/users/find-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: name, userPhoneNumber: phoneNumber }),
      });
      
      const data = await response.json();

      if (response.ok) {
        if (data && data !== null) {
          // toast({
          //   title: '성공',
          //   description: `아이디를 찾았습니다 : ${data.userId}`,
          //   status: 'success',
          //   duration: 9000,
          //   isClosable: true,
          // });
          const userId = data.userId;
          const joinDate = data.joinDate;
          navigate('/help/id2', { state: { userId, joinDate } });
          window.scrollTo(0, 0);
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

  return (

    <Box w="md" p={4} borderWidth="1px" borderRadius="lg">
        
        <form onSubmit={handleSubmit}>
        <FormLabel textAlign="left" fontSize="3xl" fontWeight="bold">아이디 찾기</FormLabel>
        
          <FormControl isRequired id="name">
            <FormLabel  fontSize="xl" mt={8}>이름</FormLabel>
            <Input isRequired maxLength={10} name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>

          <FormControl isRequired id="phone-number" isInvalid={!isValid}>
            <FormLabel fontSize="xl" mt={8}>전화번호</FormLabel>
              <Input
                onInput={(e) => {
                if (e.target.value.length > e.target.maxLength)
                  e.target.value = e.target.value.slice(0, e.target.maxLength);
                }}
                type="number"
                placeholder="-없이 입력해주세요"
                onChange={handleNumberChange}
                maxLength={11}
                required
                />
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>

          <Button fontSize="xl" w="full" mt={8} variant="unstyled" bgColor="#365BFF" textColor="white" type='submit'>확인</Button>
          </form>
        
      </Box>

  );
};

export default findId;
