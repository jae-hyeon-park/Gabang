import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card, Text, CardHeader, Heading, CardBody, Flex, Image, Box } from '@chakra-ui/react';

const MainReview = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    variableWidth: true,
  };

  const reviews = [
    {
      name: '김유은',
      image: '/images/profile1.png',
      rating: '⭐⭐⭐⭐⭐',
      content_1: '가방을 통해서 안전하게 거래할 수 있었습니다😀',
      content_2: '정말 획기적인 서비스에요',
      content_3: ' 앞으로도 가방만 사용할 거에요 가방짱!!!👍',
    },
    {
      name: '임다빈',
      image: '/images/profile2.png',
      rating: '⭐⭐⭐⭐⭐',
      content_1: '버튼 하나로 이미지를 검증할 수 있어 ',
      content_2: '굉장히 간편하고 편리하게 이용할 수 있었어요!',
      content_3: '판매자와 구매자 모두 안심하고 거래할 수 있어 추천해요!',
    },
    {
      name: '박재현',
      image: '/images/profile3.png',
      rating: '⭐⭐⭐⭐⭐',
      content_1: '중고거래 할 때 마다 걱정이 많았는데 가방을 쓰면서',
      content_2: '안심할 수 있게 되었어요!',
      content_3: '중고거래는 가방! 자주 이용할께요!',
    },
    {
      name: '임성실',
      image: '/images/profile4.png',
      rating: '⭐⭐⭐⭐⭐',
      content_1: '사진검증하는 서비스 굉장히 새로워요!!',
      content_2: '가방 덕분에 안심하고 거래할 수 있었습니다 🥰',
      content_3: '중고거래는 무조건 가방!!!!!',
    },
    {
      name: '이진천',
      image: '/images/profile5.png',
      rating: '⭐⭐⭐⭐⭐',
      content_1: '요즘 허위매물로 3자 사기 수법이 유행이라는데',
      content_2: '가방에서는 허위매물 걱정 없이 거래할 수 있어서 좋아요',
      content_3: '역시 중고거래는 가방이죠!',
    },
  ];

  return (
    <Box overflowX="hidden" h={280}>
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <Box key={index}>
            <Card
              key={index}
              boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
              borderRadius="5px"
              borderColor="gray"
              transition="0.3s"
              w="400px"
              my={6}
              mx={4}
              _hover={{ boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)' }}>
              <CardHeader display="flex" alignContent="center">
                <Image src={review.image} boxSize="50px" borderRadius="full" marginRight="3" />
                <Flex flexDirection="column">
                  <Heading size="md">{review.name}</Heading>
                  <Text fontSize="lg">{review.rating}</Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text>{review.content_1}</Text>
                <Text>{review.content_2}</Text>
                <Text>{review.content_3}</Text>
              </CardBody>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default MainReview;
