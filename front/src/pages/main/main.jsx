import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ChakraProvider,
  Box,
  Flex,
  Container,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  extendTheme,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import MainBanner from './components/MainBanner';
import MainContents from './components/MainContents';
import SvgComponent2 from './components/SvgComponent2';
import '../../App.css';
import './Zipper.css';
import { useZipper } from '../../ZipperContext';

const theme = extendTheme({
  styles: {
    global: {
      '@keyframes bounce': {
        '0%, 100%': { transform: 'translateY(-25%)' },
        '50%': { transform: 'translateY(0)' },
      },
      body: {
        width: '100%',
        height: '100vh',
        // bgGradient: 'linear(to-b, #3770FB 50%, #487cff 70%, white 100%)',
        bgGradient: 'linear(to-b, #3770FB 50%, #3770FB 100%)',
        // bgColor: '#3770FB',
        // bgGradient: 'linear(to-b, #3770FB 50%, #487cff 70%, white 100%)',
        bgGradient: 'linear(to-b, #3770FB 50%, #3770FB 100%)',
        // bgColor: '#3770FB',
        bgRepeat: 'no-repeat',
      },
    },
  },
  colors: {
    color: {
      blue: '#3770FB',
      yellow: '#FFE500',
      gray_1: '#B7B7B7',
      gray_2: '#505050',
    },
  },
});

const Main = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const { zipperOn, zipperClosing, closeZipper } = useZipper(); // 상태와 함수 사용

  const handleSearch = () => {
    if (inputValue.trim() !== '') {
      navigate(`/products?search=${encodeURIComponent(inputValue)}`);
      window.scrollTo(0, 0);
    }
  };

  // 엔터 키가 눌렸을 때 실행할 함수
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <>
      <div className="gabang">
        <ChakraProvider theme={theme}>
          <Container maxWidth="container.xl">
            <Flex direction="column" align="center" justify="center" width="100%" mt="10">
              <Flex direction="row" justify="center" w="1280px" mt={32}>
                <Flex direction="column" justify="center" align="center" mt="8">
                  <Flex align="flex-start">
                    <Text fontSize="80" fontWeight="bold" color="color.yellow">
                      가
                    </Text>
                    <Text fontSize="68" fontWeight="bold" color="white" mt={3}>
                      짜 매물
                    </Text>
                    <Box w="15px"></Box>
                    <Text fontSize="80" fontWeight="bold" color="color.yellow">
                      방
                    </Text>
                    <Text fontSize="68" fontWeight="bold" color="white" mt={3}>
                      지
                    </Text>
                  </Flex>
                  <Text fontSize="68" fontWeight="bold" color="white">
                    중고거래 서비스
                  </Text>
                  <Box mt={8} width="xl">
                    <InputGroup size="xl">
                      <Input
                        placeholder="구매할 물품을 입력하세요"
                        fontSize="xl"
                        p={5}
                        bg="white"
                        borderRadius="full"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <InputRightElement mt={3}>
                        <Button size="lg" variant="ghost" _hover={{ bgColor: 'transparent' }} onClick={handleSearch}>
                          <SearchIcon color="color.blue" boxSize="8" />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                </Flex>
              </Flex>
              {/* <SvgComponent /> */}
            </Flex>
          </Container>
        </ChakraProvider>
        <MainContents />
        <MainBanner />
      </div>

      {zipperOn && (
        <div>
          <div className={`zziper ${zipperClosing ? 'fadeout' : ''}`}>
            <SvgComponent2 closeZipper={closeZipper} />
          </div>
          {/* <div className={`white-background ${zipperClosing ? 'fadeout' : ''}`}></div> */}
        </div>
      )}
    </>
  );
};

export default Main;
