import React from 'react';
import { Box, Text, Flex, Image } from '@chakra-ui/react';

const MainBanner = () => {
  return (
    <Box position="relative" left="0" width="100%" bg="#3770FB" fontSize="2xl" p="3em" textAlign="center">
      <Flex justify="center" align="center" mb={10}>
        <Image src="/images/logo2(ko).png" style={{ width: '150px' }} />
      </Flex>
      <Flex justify="center" align="center">
        <Text color="white" fontWeight="bold" display="inline-block">
          가방은 (주)ABOBA의{' '}
          <Text as="span" color="color.yellow" fontWeight="bold" display="inline-block">
            가짜 매물을 방지하는 중고거래 서비스{' '}
          </Text>
          에요
        </Text>
      </Flex>
      <Flex justify="center" align="center">
        <Text color="white" fontWeight="bold">
          허위 매물을 올릴 수 없도록 필터링하여 사기 피해를 예방해드려요
        </Text>
      </Flex>
    </Box>
  );
};

export default MainBanner;
