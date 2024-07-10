import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Button, Heading, Text, Tag, Stack, TagLabel, useDisclosure } from '@chakra-ui/react';

import ProductDetailInfo from './components/ProducDetailInfo';
import ProductCategory from './components/ProductCategory';
import ProductInfo from './components/ProductInfo';
import ReportModal from '../reportModal/reportModal';
import ChatModal from '../chatModal/chatModal';
import { useNavigate } from 'react-router';
import ImageSlider from './components/ImageSlider';
import { getPayload, isCookie, isAuth } from '../../utils/cookie';

const GetProductDetail = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState(null);
  const handleNavigate = (path) => {
    navigate(path, {
      state: {
        productId: Id,
        imageUrl: productDetail.imageURLs[0],
        productName: productDetail.productName,
        pPrice: productDetail.productPrice,
      },
    });
    window.scrollTo(0, 0);
  };

  const { isOpen: isOpenReportModal, onOpen: onOpenReportModal, onClose: onCloseReportModal } = useDisclosure();
  const { isOpen: isOpenChatList, onOpen: onOpenChatList, onClose: onCloseChatList } = useDisclosure();
  const handleInputComplete = () => {
    onCloseReportModal();
  };

  const handleOpenReportModal = () => {
    if (isAuth('token') == false) {
      navigate('/signin');
    } else {
      onOpenReportModal();
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`/api/products/${Id}`);
        const productData = await response.json();
        setProductDetail({ ...productData });
      } catch (error) {
        console.error('Fetching product details failed:', error);
      }
    };

    fetchProductDetail();
  }, [Id]);

  const tagColorScheme = {
    '1': { label: '판매중', bgcolor: 'color.blue', textcolor: 'white' },
    '2': { label: '예약중', bgcolor: 'color.yellow', textcolor: 'black' },
    '3': { label: '판매완료', bgcolor: 'color.gray_1', textcolor: 'color.gray_2' },
  };

  const productTag = productDetail ? tagColorScheme[productDetail.tradeState] : { label: '', bgcolor: 'color.gray_1' };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format(price);
  };

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  return (
    <Box maxWidth="container.xl" w="1280px" mt={50}>
      <ProductCategory productDetail={productDetail} />
      <Flex align="center" justify="start" mt={30}>
        <Box height="40vh" w="30vw">
          <ImageSlider images={productDetail.imageURLs || []} />
        </Box>
        <Stack spacing={1} width="80%" ml="5%">
          <Flex>
            <Heading as="h1" size="xl" mb="1rem">
              {productDetail.productName}
            </Heading>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex>
              <Text fontSize="3xl" fontWeight="bold" mr="1em">
                {`${formatPrice(productDetail.productPrice)}`}원
              </Text>
              <Stack direction="row" align="baseline" justify="center" alignItems="center">
                <Tag size="lg" bgColor={productTag.bgcolor} color={productTag.textcolor}>
                  <TagLabel>{productTag.label}</TagLabel>
                </Tag>
              </Stack>
            </Flex>
            <Button
              onClick={handleOpenReportModal}
              variant="ghost"
              fontSize="md"
              color="gray"
              fontWeight="bold"
              textDecoration="underline"
              _hover={{
                bgColor: 'white',
              }}>
              신고하기
            </Button>
          </Flex>
          <ProductDetailInfo productDetail={productDetail} />
          <Flex justify="space-between" align="center">
            <Button
              data-cy="open-chat-button"
              onClick={onOpenChatList}
              bgColor="white"
              textColor="black"
              p={7}
              border="1px"
              width="100%"
              mr="1em"
              _hover={{
                bgColor: 'white',
                textColor: 'black',
              }}
              isDisabled={isAuth('token') && getPayload('token').userId !== productDetail.seller.userId ? false : true}>
              채팅하기
            </Button>
            <Button
              bgColor="color.blue"
              textColor="white"
              p={7}
              width="100%"
              onClick={() => handleNavigate('/orders/order')}
              _hover={{
                bgColor: 'color.blue',
                textColor: 'white',
              }}
              isDisabled={
                productDetail.tradeState === '1' &&
                isAuth('token') &&
                getPayload('token').userId !== productDetail.seller.userId
                  ? false
                  : true
              } //상태에 따른 버튼 비활성화
            >
              안전결제
            </Button>
          </Flex>
        </Stack>
      </Flex>
      <ProductInfo productDetail={productDetail} />

      <ReportModal isOpenReportModal={isOpenReportModal} onCloseReportModal={onCloseReportModal} productId={Id} />
      <ChatModal
        isOpenChatList={isOpenChatList}
        onCloseChatList={onCloseChatList}
        productId={Id}
        productDetail={productDetail}
      />
    </Box>
  );
};

export default GetProductDetail;
