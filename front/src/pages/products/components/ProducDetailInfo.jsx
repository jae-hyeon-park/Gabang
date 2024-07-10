import React from 'react';
import { Box, HStack, Text, SimpleGrid } from '@chakra-ui/react';

const ProductDetailInfo = ({ productDetail }) => {
  // 거래방식 텍스트 변환
  const tradeWayText = (tradeWay) => {
    switch (tradeWay) {
      case 'A':
        return '모두 가능';
      case 'G':
        return '직거래';
      case 'T':
        return '택배';
      default:
        return tradeWay;
    }
  };

  // 배송비 텍스트 변환
  const deliveryFeeText = productDetail.ynDeliveryfee ? '포함' : '미포함';

  // 등록일자 포맷 변환
  const formattedDate = new Date(productDetail.registrationDate).toLocaleDateString();

  return (
    <Box py={6}>
      <SimpleGrid columns={2} spacing={7} textAlign="left">
        <HStack align="flex-start">
          <Text fontSize="lg" color="gray">
            판매자
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {productDetail.seller?.userName}
          </Text>
        </HStack>
        <HStack align="flex-start">
          <Text fontSize="lg" color="gray">
            거래방식
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {tradeWayText(productDetail.tradeWay)}
          </Text>
        </HStack>
        <HStack align="flex-start">
          <Text fontSize="lg" color="gray">
            배송비
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {deliveryFeeText}
          </Text>
        </HStack>
        <HStack align="flex-start">
          <Text fontSize="lg" color="gray">
            거래지역
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {productDetail.tradeLocation}
          </Text>
        </HStack>
        <HStack align="flex-start" minWidth={80}>
          <Text fontSize="lg" color="gray">
            등록일자
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {formattedDate}
          </Text>
        </HStack>
      </SimpleGrid>
    </Box>
  );
};

export default ProductDetailInfo;
