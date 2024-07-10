import React from 'react';
import { Box, Container, Grid, Text, VStack, HStack, Link, Flex, Icon, Divider } from '@chakra-ui/react';
import { EmailIcon, InfoIcon, PhoneIcon, AtSignIcon } from '@chakra-ui/icons';

const Footer = () => {
  return (
    <Box w="1280px">
      <Container as="footer" maxWidth="container.xl" pb={10} paddingX={0}>
        <Grid gap={8} mb={10}>
          <VStack align="flex-start" spacing={3}>
            <Text fontWeight="bold">(주)ABOBA 사업자 정보</Text>
            <Text>(주)ABOBA 대표자 임성실</Text>
            <Text>사업자 등록번호 : 000-00-00000</Text>
            <Text>통신판매신고번호 : 제2024-서울마포-0000호</Text>
            <Text>주소 : 서울특별시 마포구 상암IT타워 6층</Text>
            <Text>대표번호 : 0000-0000</Text>
            <Text>메일 : gabang@gabang.co.kr</Text>
            <Text>호스팅제공자 : 아마존웹서비스</Text>
          </VStack>
          <Flex justifyContent="space-between">
            <HStack align="flex-start" spacing={3}>
              <Link href="/#">
                <Text fontWeight="bold">이용약관</Text>
              </Link>
              <div> | </div>
              <Link href="/#">
                <Text fontWeight="bold">개인정보처리방침</Text>
              </Link>
              <div> | </div>
              <Link href="/#">
                <Text fontWeight="bold">분쟁처리절차</Text>
              </Link>
              <div> | </div>
              <Link href="/#">
                <Text fontWeight="bold">고객센터</Text>
              </Link>
            </HStack>

            <HStack spacing={8}>
              <Link href="/#">
                <Icon as={EmailIcon} boxSize={6} />
              </Link>
              <Link href="/#">
                <Icon as={InfoIcon} boxSize={6} />
              </Link>
              <Link href="/#">
                <Icon as={PhoneIcon} boxSize={6} />
              </Link>
              <Link href="/#">
                <Icon as={AtSignIcon} boxSize={6} />
              </Link>
            </HStack>
          </Flex>
        </Grid>
        <Text fontSize="sm" mt={4} textAlign="center" borderTop="1px" borderColor="color.gray_1" pt={5}>
          "가방" 상점의 판매상품을 제외한 모든 상품들에 대하여, (주)ABOBA는 통신판매중개자로서 거래 당사자가 아니며 판매
          및 구매 회원 간의 상품거래 정보 및 거래에 관여하지 않고, 어떠한 의무와 책임도 부담하지 않습니다.
        </Text>
        <Text fontSize="sm" mt={2} textAlign="center">
          © 2024 가방 Inc. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
