// src/components/SignUpCompletePage.jsx
import React from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@chakra-ui/icons';

const SignUpCompletePage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <Box w="md" >
      <Box textAlign="center" mb={8} mt={4}>
        <CheckCircleIcon boxSize={16} color="#3770FB" />
        <Heading as="h2" size="lg" mt={8}>
          회원가입이 완료되었습니다!
        </Heading>
        <Text fontSize="lg" mt={8}>이제부터 가방의 모든 서비스를 이용하실 수 있습니다.</Text>
        <Text fontSize="lg" mt={1}>
          안전한 중고거래를 위해{' '}
          <Text as="span" textDecoration="underline" fontWeight="bold">
            안전결제
          </Text>{' '}
          를 이용해 주세요.
        </Text>
      </Box>
      <Box textAlign="center">
        <Button
          bgColor="#3770FB"
          textColor="white"
          fontSize="xl"
          w="100%"
          onClick={() => handleNavigate("/signin")}
          _hover={{
            bgColor: '#3770FB',
            textColor: 'white',
          }}
        >
          로그인하기
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpCompletePage;
