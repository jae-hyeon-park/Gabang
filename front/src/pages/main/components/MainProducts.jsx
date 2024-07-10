import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Image, Text, useColorModeValue, VStack, Button, Flex } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const MainProducts = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const [products, setProducts] = useState([]);
  useEffect(() => {
    // 상품 목록 불러오기
    fetch('/api/products')
      .then((response) => response.json())
      .then(async (rawdata) => {
        const reversedData = rawdata.reverse();
        const data = reversedData.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
        const slicedData = data.slice(0, 20);
        return setProducts(slicedData);
      })
      .catch((error) => console.error('Fetching products failed', error));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format(price);
  };

  // 날짜 계산
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true, locale: ko });
  };

  return (
    <Box maxWidth="container.xl" w="1280px">
      <VStack spacing={10} align="stretch" justify="center" my={28}>
        <Flex align="center" mb={5}>
          <Text fontSize="3xl" fontWeight="bold">
            최근 올라온 상품
          </Text>
          <Button
            bgColor="color.blue"
            textColor="white"
            ml={5}
            _hover={{
              bgColor: 'color.blue',
              textColor: 'white',
            }}
            size="md"
            fontSize="md"
            onClick={() => handleNavigate(`/products`)}>
            전체상품 보기
          </Button>
        </Flex>
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }}
          gap={6}>
          {products.map((product) => (
            <Box
              data-cy="main-product"
              key={product.productId}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={borderColor}
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleNavigate(`/products/${product.productId}`)}
              bg="white">
              <Box width="100%" height="0" pb="75%" position="relative">
                <Image
                  src={product.imageUrl}
                  alt={product.productName}
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </Box>
              <Flex justify="space-between">
                <Box p="3">
                  <Text fontWeight="bold" noOfLines={1}>
                    {product.productName}
                  </Text>
                  <Text>{`${formatPrice(product.productPrice)}원`}</Text>
                </Box>
                <Box p="3" alignContent="end">
                  <Text>{timeAgo(product.registrationDate)}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default MainProducts;
