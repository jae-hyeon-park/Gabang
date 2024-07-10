import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const ProductInfo = ({ productDetail }) => {
  return (
    <Box maxWidth="container.xl" mt={28}>
      <Box borderBottom="1px" borderColor="color.gray_1" pb={5}>
        <Text fontSize="3xl" fontWeight="bold">
          상품 정보
        </Text>
      </Box>

      <Text mt={14}>{productDetail.productExplain}</Text>
    </Box>
  );
};

export default ProductInfo;
