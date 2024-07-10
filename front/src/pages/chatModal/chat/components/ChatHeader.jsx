import React, { useState, useEffect } from 'react';
import { Flex, Avatar, Text, IconButton, DrawerCloseButton, Center, Grid, GridItem } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { getPayload } from '../../../../utils/cookie';

const Header = ({ onBackList, productDetail, productId, selectedChat }) => {
  const [product, setProduct] = useState({});
  const user = getPayload('token').userId;

  const otherUser = productDetail
    ? productDetail.seller?.userId
    : selectedChat.user1 === user
      ? selectedChat.user2
      : selectedChat.user1;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format(price);
  };

  useEffect(() => {
    const fetchProductDetail = () => {
      let currentId = productId || (selectedChat ? selectedChat.productId : null);
      if (!currentId) return;

      const url = `/api/products/${currentId}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          return response.json();
        })
        .then((productData) => {
          const imageUrls = productData.imageURLs;
          const imageUrl = imageUrls.length > 0 ? imageUrls[0] : null;
          setProduct({ ...productData, imageUrl });
        })
        .catch((error) => {
          console.error('Fetching product details failed:', error);
        });
    };

    fetchProductDetail();
  }, [productId, selectedChat]);

  return (
    <>
      <Grid templateColumns="repeat(5, 1fr)" gap={4} mt="3">
        {selectedChat && (
          <GridItem colStart={1} colEnd={2} h="10" ml="2.5">
            <IconButton
              aria-label="뒤로가기"
              icon={<ChevronLeftIcon />}
              onClick={onBackList}
              variant="ghost"
              fontSize="35px"
            />
          </GridItem>
        )}

        <GridItem colStart={2} colEnd={5} h="10" mt="1">
          <Center>
            <Avatar bg="teal.500" size="sm" />
            <Flex flexDirection="column" mx="2" justify="center">
              <Text fontSize="md" fontWeight="bold">
                {otherUser}
              </Text>
            </Flex>
          </Center>
        </GridItem>
      </Grid>

      {getPayload('token').role !== 'ROLE_ADMIN' && (
        <Flex mt="1">
          <Avatar mt="1" ml="7" size="lg" borderRadius="10" name="product" src={product.imageUrl} />
          <Flex flexDirection="column" mx="4" justify="center">
            <Text fontSize="lg" fontWeight="bold">
              {`${formatPrice(product.productPrice)}`}원
            </Text>
            <Text>{product.productName}</Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Header;
