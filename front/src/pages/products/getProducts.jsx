import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Image,
  Text,
  Tag,
  TagLabel,
  useColorModeValue,
  VStack,
  Flex,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductCategory from './components/ProductCategory';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const GetProducts = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [tradeStateFilter, setTradeStateFilter] = useState(null);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search) {
      const searchParams = new URLSearchParams(location.search);
      setSearchTerm(searchParams.get('search') || '');
    }
  }, [location.search]);

  const handleSearch = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', inputValue);
    navigate(`/products?${searchParams.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const searchParams = new URLSearchParams(location.search);
      let url = '/api/products';

      // 카테고리와 검색어가 존재하는 경우, URL에 포함
      if (searchParams.has('category') || searchParams.has('search')) {
        url += `?${searchParams.toString()}`;
      }

      try {
        const response = await fetch(url);
        const rawdata = await response.json();
        const data = rawdata.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
        return setProducts(data);
      } catch (error) {
        console.error('Fetching products failed', error);
      }
    };

    fetchProducts();
  }, [location.search]);

  // const filteredProducts = products.filter((product) =>
  //   product.productName.toLowerCase().includes(searchTerm ? searchTerm.toLowerCase() : ''),
  // );

  const filteredProducts = products.filter((product) => {
    return (
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!tradeStateFilter || product.tradeState === tradeStateFilter)
    );
  });
  console.log(products);
  const handleTradeStateFilter = (state) => {
    setTradeStateFilter(state);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'decimal' }).format(price);
  };

  const sortProducts = (products) => {
    switch (sortOrder) {
      case 'priceLowToHigh':
        return [...products].sort((a, b) => a.productPrice - b.productPrice);
      case 'priceHighToLow':
        return [...products].sort((a, b) => b.productPrice - a.productPrice);
      case 'newest':
      default:
        return [...products].sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const sortedProducts = sortProducts(products);
      setProducts(sortedProducts);
    }
  }, [sortOrder, location.search]);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true, locale: ko });
  };

  const tagColorScheme = {
    '1': { label: '판매중', bgcolor: 'color.blue', textcolor: 'white' },
    '2': { label: '예약중', bgcolor: 'color.yellow', textcolor: 'black' },
    '3': { label: '판매완료', bgcolor: 'color.gray_1', textcolor: 'black' },
  };

  if (filteredProducts.length === 0) {
    return (
      <Box maxWidth="container.xl" w="1280px" mt={50}>
        <Text fontSize="xl" mt={5} textAlign="center">
          해당 상품이 없습니다.
        </Text>
      </Box>
    );
  }

  return (
    <Box maxWidth="container.xl" w="1280px" mt={50}>
      <VStack spacing={3} align="stretch" justify="center">
        <HStack display="flex" justifyContent="space-between">
          <ProductCategory />
          <Box>
            <InputGroup size="md" maxW="sm">
              <Input
                border="2px"
                borderColor="color.blue"
                _hover={{ bgColor: 'transparent' }}
                _focus={{
                  borderColor: 'color.blue',
                  boxShadow: 'none',
                }}
                placeholder="카테고리 내 검색"
                p={2}
                bg="white"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSearch}
                  _hover={{ bgColor: 'transparent' }}
                  data-cy="search-button">
                  <SearchIcon color="color.blue" boxSize="4" />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
        </HStack>
        <HStack spacing={4} justifyContent="flex-end" mt={5}>
          <Button
            p={0}
            bgColor="white"
            onClick={() => handleTradeStateFilter(null)}
            _hover={{ bgColor: 'transparent', color: 'color.blue' }}>
            전체
          </Button>
          <div> | </div>
          <Button
            p={0}
            bgColor="white"
            onClick={() => handleTradeStateFilter('1')}
            _hover={{ bgColor: 'transparent', color: 'color.blue' }}>
            판매중
          </Button>
          <div> | </div>
          <Button
            p={0}
            bgColor="white"
            onClick={() => handleTradeStateFilter('2')}
            _hover={{ bgColor: 'transparent', color: 'color.blue' }}>
            예약중
          </Button>
          <div> | </div>
          <Button
            p={0}
            bgColor="white"
            onClick={() => handleTradeStateFilter('3')}
            _hover={{ bgColor: 'transparent', color: 'color.blue' }}>
            {' '}
            판매완료
          </Button>
        </HStack>
        <HStack spacing={4} justifyContent="flex-end">
          <Button
            onClick={() => setSortOrder('newest')}
            p={0}
            bgColor="white"
            _hover={{ bgColor: 'transparent', color: 'color.blue' }}>
            최신순
          </Button>
          <div> | </div>
          <Button
            onClick={() => setSortOrder('priceLowToHigh')}
            p={0}
            bgColor="white"
            _hover={{ bgColor: 'transparent', color: 'color.blue' }}>
            낮은가격순
          </Button>
          <div> | </div>
          <Button
            onClick={() => setSortOrder('priceHighToLow')}
            p={0}
            bgColor="white"
            _hover={{ bgColor: 'transparent', color: 'color.blue' }}>
            {' '}
            높은가격순
          </Button>
        </HStack>

        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }}
          gap={6}
          mt={5}>
          {filteredProducts.map((product) => (
            <Box
              data-cy="product"
              key={product.productId}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={borderColor}
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleNavigate(`/products/${product.productId}`)}
              bg="white">
              <Box width="12vw" height="0" pb="75%" position="relative">
                <Image
                  src={product.imageUrl}
                  alt={product.productName}
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  data-cy="product-image"
                />
              </Box>
              <Flex justify="space-between">
                <Box p="3">
                  <Text fontWeight="bold" noOfLines={1} data-cy="product-name">
                    {product.productName.length > 8
                      ? `${product.productName.substring(0, 6)} ...`
                      : product.productName}
                  </Text>
                  <Text data-cy="product-price">{`${formatPrice(product.productPrice)}원`}</Text>
                </Box>

                <Box pr={3} display="flex" flexDirection="column" alignItems="end" justifyContent="center">
                  <Tag
                    bgColor={tagColorScheme[product.tradeState]?.bgcolor}
                    textColor={tagColorScheme[product.tradeState]?.textcolor}
                    size="md"
                    variant="solid"
                    mb="1">
                    {tagColorScheme[product.tradeState]?.label}
                  </Tag>
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

export default GetProducts;
