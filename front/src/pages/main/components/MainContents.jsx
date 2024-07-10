import React from 'react';
import { Text, Box, Flex, Image, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Scan from './Scan';
import MainReview from './MainReview';

const MainContents = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <Box mt="500px" bgColor="white" maxWidth="container.xl">
      <Flex mb={50}>
        <Flex flexDirection="column" w="50%" align="center" justify="center">
          <Flex>
            <Text fontSize="40" fontWeight="bold" mb={5} color="color.blue">
              사진 검증
            </Text>
            <Text fontSize="40" fontWeight="bold" mb={5}>
              을 통한 허위 매물 방지
            </Text>
          </Flex>
          <Text fontSize="25" fontWeight="bold">
            사진 검증 기술을 통해 온라인 상의 이미지와 비교하여
          </Text>
          <Text fontSize="25" fontWeight="bold">
            매물의 진위 여부를 실시간으로 검증해요
          </Text>
          <Button
            bgColor="color.blue"
            textColor="white"
            mt={6}
            _hover={{
              bgColor: 'color.blue',
              textColor: 'white',
            }}
            size="lg"
            fontSize="lg"
            onClick={() => handleNavigate(`/product/regist`)}>
            상품 판매하기
          </Button>
        </Flex>
        <Box w="50%" overflow="hidden">
          <Scan />
        </Box>
      </Flex>
      <Flex my={32}>
        <Box w="50%" overflow="hidden" ml={12}>
          {/* <Scan /> */}
          <Image src="/images/gabang.gif" transform="scale(1.05)" />
        </Box>
        <Flex flexDirection="column" w="50%" align="center" justify="center">
          <Flex>
            <Text fontSize="40" fontWeight="bold" mb={5} color="color.blue">
              안전 결제
            </Text>
            <Text fontSize="40" fontWeight="bold" mb={5}>
              를 통한 안심 거래
            </Text>
          </Flex>
          <Text fontSize="25" fontWeight="bold">
            가방이 결제 금액을 안전하게 보호하고 있다가
          </Text>
          <Text fontSize="25" fontWeight="bold">
            구매자가 구매를 확정하면 판매자에게 입금이 돼요
          </Text>
          <Button
            bgColor="color.blue"
            textColor="white"
            mt={6}
            _hover={{
              bgColor: 'color.blue',
              textColor: 'white',
            }}
            size="lg"
            fontSize="lg"
            onClick={() => handleNavigate(`/products`)}>
            상품 구매하기
          </Button>
        </Flex>
      </Flex>
      <Box my={32}>
        <Text fontSize="40" fontWeight="bold" mt={52} mb={12}>
          생생한 고객 후기
        </Text>
        <MainReview />
      </Box>
    </Box>
  );
};

export default MainContents;
